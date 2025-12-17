import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import database, { Quiz, User } from './../../DatabaseController';

export default function HomeScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setUsers(await database.getUsers());
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        const loadQuizzes = async () => {
            try {
                setQuizzes(await database.getQuizzes());
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };

        loadUsers();
        loadQuizzes();
    }, []);

    const resetDatabase = async () => {
        try {
            await database.databaseReset();
            setUsers([]);
            setQuizzes([]);
            alert('Database has been reset.');
            console.log('Database reset successfully.');
        } catch (error) {
            console.error('Error resetting database:', error);
            alert('Failed to reset database.');
        }
    };

    const listUsers = () => {
        if (users.length === 0) {
            console.log("No users found");
        } else {
            users.forEach((user) => {
                console.log("Username: " + user.username + "   Password: " + user.password + "   Security Question: " + user.securityQuestion + "   Security Answer: " + user.securityAnswer);
            });
        }
    };

    const listQuizzes = async () => {
        if (quizzes.length === 0) {
            console.log("No quizzes found");
        } else {
            quizzes.forEach((quiz) => {
                console.log("ID:" + quiz.id + "  Name: " + quiz.name + "   UserID: " + quiz.userID);
            });
        }
    };
    
    return (
        <View>
            <Button title="List Users" onPress={listUsers} />
            <Button title="List quizzes" onPress={listQuizzes} />
            <Button title="Reset Database" onPress={resetDatabase} />
        </View>
    );
}