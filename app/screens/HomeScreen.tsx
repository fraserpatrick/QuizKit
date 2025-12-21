import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './../../assets/images/Styles';
import database, { Quiz } from "./../../DatabaseController";

export default function HomeScreen() {
    const navigation = useNavigation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const loadQuizzes = async () => {
        try {
            setQuizzes(await database.getQuizzes());
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
        navigation.navigate('QuizEditor' as never, { passedQuizID: quiz.id, quizName: quiz.name } as never);
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={handleCreateQuiz} >
                <View style={styles.loginScreen_button}>
                    <Text style={styles.loginScreen_buttonText}>Create Quiz</Text>
                </View>
            </TouchableOpacity>
            <SafeAreaView>
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