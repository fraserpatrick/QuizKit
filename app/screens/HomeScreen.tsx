import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './../../assets/images/Styles';
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
        <TouchableOpacity onPress={onPress} style={styles.loginScreen_button}>
            <View>
                <Text style={styles.loginScreen_buttonText}>{quiz.name}</Text>
            </View>
        </TouchableOpacity>
    );


    const handleCreateQuiz = () => {
        navigation.navigate('QuizCreationScreen' as never);
    }

    const handleOpenQuiz = (quiz: Quiz) => {
        alert('Opening quizID: ' + quiz.id + ' with name: ' + quiz.name);
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
        <SafeAreaView>
            <TouchableOpacity onPress={handleCreateQuiz} >
                <View style={styles.loginScreen_button}>
                    <Text style={styles.loginScreen_buttonText}>Create Quiz</Text>
                </View>
            </TouchableOpacity>
            <SafeAreaView>
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
            </SafeAreaView>
        </SafeAreaView>
    );
}