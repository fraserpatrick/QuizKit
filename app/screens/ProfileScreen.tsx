import { Text, Button, View } from 'react-native';
import { useAuth } from '@/app/AuthContext';
import database, { Quiz, User } from '@/DatabaseController';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
    const { username } = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setQuizzes(await database.getQuizzes());
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };
        const loadUsers = async () => {
            try {
                setUsers(await database.getUsers());
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadQuizzes();
        loadUsers();
    }, []);


    const listDatabase = async () => {
        if (quizzes.length === 0) {
            console.log("No quizzes found");
        } else {
            console.log("Quizzes:");
            quizzes.forEach((quiz) => {
                console.log("ID:" + quiz.id + "  Name: " + quiz.name + "   UserID: " + quiz.userID + "   Visibility: " + quiz.visibility);
            });
        }
        if (users.length === 0) {
            console.log("No users found");
        } else {
            console.log("Users:");
            users.forEach((user) => {
                console.log("ID:" + user.id + "  Email: " + user.email + "   Username: " + user.username);
            });
        }
    };

    const resetDatabase = async () => {
            try {
                await database.databaseReset();
                alert('Database has been reset.');
                console.log('Database reset successfully.');
            } catch (error) {
                console.error('Error resetting database:', error);
                alert('Failed to reset database.');
            }
        };


    return (
        <View>
            <Button title="Reset Database" onPress={resetDatabase} />
            <Button title="List Database" onPress={listDatabase} />
            <Text>Logged in as: {username}</Text>
        </View>
    );
}