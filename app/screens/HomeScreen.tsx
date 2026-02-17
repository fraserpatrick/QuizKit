import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Button } from 'react-native';
import { Quiz } from "@/DatabaseController";
import { SegmentedButtons } from 'react-native-paper';
import { useAuth } from "@/app/AuthContext";
import PrimaryButtonWithIcon from "@/app/components/Button"; 
import { getOwnedQuizzes, getSharedQuizzes } from "@/api/quizzes";
import { QuizItem } from "../components/QuizAndQuestionItem";

export default function HomeScreen() {
    const navigation = useNavigation();
    const {username} = useAuth();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'QuizKit',
            headerRight: () => (
                <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen' as never)} />
            ),
            headerTitleStyle: {
                fontWeight: 'bold',
            },
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
            <PrimaryButtonWithIcon label="Create Quiz" onPress={handleCreateQuiz} icon="form"/>
            <View style={styles.quizContainer}>
                <SegmentedButtons
                    theme={{ colors: { secondaryContainer: '#007BFF', onSecondaryContainer: '#FFFFFF' } }}
                    value={selector}
                    onValueChange={setSelector}
                    buttons={[
                        { value: 'myQuizzes', label: 'My Quizzes', showSelectedCheck:true }, { value: 'sharedQuizzes', label: 'Shared Quizzes', showSelectedCheck:true},        
                    ]}
                />
                <FlatList
                    data={quizzes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <QuizItem
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
});