import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Button } from 'react-native';
import { Quiz } from "@/DatabaseController";
import { SegmentedButtons } from 'react-native-paper';
import { useAuth } from "@/app/AuthContext";
import PrimaryButton from "@/app/components/Button"; 
import { getOwnedQuizzes, getSharedQuizzes } from "@/api/quizzes";

export default function HomeScreen() {
    const navigation = useNavigation();
    const {username} = useAuth();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'QuizKit',
            headerRight: () => (
                <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen' as never)} />
            )
        });
        }, []);

    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
    const [sharedQuizzes, setSharedQuizzes] = useState<Quiz[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selector, setSelector] = useState('myQuizzes');

    const loadQuizzes = async () => {
        try {
            const myQuizzes = await getOwnedQuizzes(username!);
            setMyQuizzes(myQuizzes);
            const sharedQuizzes = await getSharedQuizzes(username!);
            setSharedQuizzes(sharedQuizzes);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!username) return;
            loadQuizzes();
        }, [username])
    );


    type ItemProps = {
        quiz: Quiz;
        onPress: () => void;
    };

    const Item = ({ quiz, onPress }: ItemProps) => (
        <TouchableOpacity onPress={onPress} style={styles.quizItem}>
            <View>
                <Text style={styles.buttonText}>{quiz.title}</Text>
            </View>
        </TouchableOpacity>
    );


    const handleCreateQuiz = () => {
        navigation.navigate('QuizInfoEditor', {passedQuiz: null});
    }

    const handleOpenQuiz = (quiz: Quiz) => {
        navigation.navigate('QuizInfoScreen', { passedQuiz: quiz });
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
            <PrimaryButton label="Create Quiz" onPress={handleCreateQuiz}/>
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
    quizItem:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
});