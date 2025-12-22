import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import database, { Quiz } from "./../../DatabaseController";
import { SegmentedButtons } from 'react-native-paper';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
    const [sharedQuizzes, setSharedQuizzes] = useState<Quiz[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selector, setSelector] = useState('myQuizzes');

    const loadQuizzes = async () => {
        try {
            const loadingQuizzes = await database.getQuizzes();
            setMyQuizzes(loadingQuizzes);
        } catch (error) {
            console.error('Error loading quizzes:', error);
        }
    };

    useEffect(() => {
        loadQuizzes();
    }, []);


    type ItemProps = {
        quiz: Quiz;
        onPress: () => void;
    };

    const Item = ({ quiz, onPress }: ItemProps) => (
        <TouchableOpacity onPress={onPress} style={styles.quizItem}>
            <View>
                <Text style={styles.buttonText}>{quiz.name}</Text>
            </View>
        </TouchableOpacity>
    );


    const handleCreateQuiz = () => {
        navigation.navigate('QuizCreationScreen' as never);
    }

    const handleOpenQuiz = (quiz: Quiz) => {
        navigation.navigate('QuizInfoScreen' as never, { passedQuiz: quiz } as never);
    };

    useEffect(() => {
        if (selector === 'myQuizzes') {
            setQuizzes(myQuizzes);
        } else {
            setQuizzes(sharedQuizzes);
        }
    }, [selector, myQuizzes, sharedQuizzes]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleCreateQuiz} >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Create Quiz</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.quizContainer}>
                <SegmentedButtons
                    value={selector}
                    onValueChange={setSelector}
                    buttons={[
                        { value: 'myQuizzes', label: 'My Quizzes'}, { value: 'sharedQuizzes', label: 'Shared Quizzes'},        
                    ]}
                />
                <FlatList
                    data={quizzes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <Item
                            quiz={item}
                            onPress={() => handleOpenQuiz(item)}
                        />
                    )}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    quizContainer:{
        flex: 1,
        marginTop: 30,
    },
    button:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
        borderWidth: 2,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
    quizItem:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
});