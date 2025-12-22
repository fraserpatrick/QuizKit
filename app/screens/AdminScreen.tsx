import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import database, { Quiz } from '@/DatabaseController';

export default function HomeScreen() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setQuizzes(await database.getQuizzes());
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };

        loadQuizzes();
    }, []);

    const resetDatabase = async () => {
        try {
            await database.databaseReset();
            setQuizzes([]);
            alert('Database has been reset.');
            console.log('Database reset successfully.');
        } catch (error) {
            console.error('Error resetting database:', error);
            alert('Failed to reset database.');
        }
    };


    const listQuizzes = async () => {
        if (quizzes.length === 0) {
            console.log("No quizzes found");
        } else {
            quizzes.forEach((quiz) => {
                console.log("ID:" + quiz.id + "  Name: " + quiz.name + "   UserID: " + quiz.userID + "   Visibility: " + quiz.visibility);
            });
        }
    };
    
    return (
        <View>
            <Button title="List quizzes" onPress={listQuizzes} />
            <Button title="Reset Database" onPress={resetDatabase} />
        </View>
    );
}