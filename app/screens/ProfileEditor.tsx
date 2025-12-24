import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/app/AuthContext';
import database, { Quiz, User } from '@/DatabaseController';

export default function ProfileEditor() {
    const { username, user, changeUsername } = useAuth();
    const navigation = useNavigation();

    const [TEMPquizzes, TEMPsetQuizzes] = useState<Quiz[]>([]);
    const [TEMPusers, TEMPsetUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                TEMPsetQuizzes(await database.getQuizzes());
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };
        const loadUsers = async () => {
            try {
                TEMPsetUsers(await database.getUsers());
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadQuizzes();
        loadUsers();
    }, []);


    const listDatabase = async () => {
        if (TEMPquizzes.length === 0) {
            console.log("No quizzes found");
        } else {
            console.log("Quizzes:");
            TEMPquizzes.forEach((quiz) => {
                console.log("ID:" + quiz.id + "  Name: " + quiz.name + "   UserID: " + quiz.userID + "   Visibility: " + quiz.visibility);
            });
        }
        if (TEMPusers.length === 0) {
            console.log("No users found");
        } else {
            console.log("Users:");
            TEMPusers.forEach((user) => {
                console.log("ID:" + user.id + "  Email: " + user.email + "   Username: " + user.username + "   TotalQuizPlays: " + user.totalQuizPlays + "   TotalQuestionsAnswered: " + user.totalQuestionsAnswered + "   TotalQuestionsCorrect: " + user.TotalQuestionsCorrect);
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




    const [usernameInput, setUsernameInput] = useState(username!);
    const [passwordInput1, setPasswordInput1] = useState('');
    const [passwordInput2, setPasswordInput2] = useState('');

    const handleProfileSave = async () => {
        if (passwordInput1.trim() !== passwordInput2.trim()) {
            alert('Passwords do not match.');
            return;
        }

        if (usernameInput.trim() === '') {
            alert('Username cannot be empty.');
            return;
        }

        if (usernameInput !== username) {
            const existingUsers = await database.getUserByUsername(usernameInput);
            if (existingUsers.length > 0) {
                alert('Username is already taken.');
                return;
            }

            try {
                await database.updateUsername(user!.email!, usernameInput);
                await database.updateQuizToNewUsername(username!, usernameInput);
                changeUsername(usernameInput);
                alert('Username updated successfully.');
                navigation.goBack();
            } catch (error) {
                console.error('Error updating username:', error);
                alert('Failed to update username.');
            }
        }

        if (passwordInput1.trim() !== '') {
            try {
                
                alert('Password updated successfully.');
            } catch (error) {
                console.error('Error updating password:', error);
                alert('Failed to update password.');
            }
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.inputHeader}>Username:</Text>
                <TextInput
                    style={styles.input}
                    value={usernameInput}
                    onChangeText={setUsernameInput}
                    returnKeyType="done"
                />

                <Text style={styles.inputHeader}>New Password:</Text>
                <TextInput
                    style={styles.input}
                    value={passwordInput1}
                    onChangeText={setPasswordInput1}
                    secureTextEntry
                    returnKeyType="done"
                />
                <Text style={styles.inputHeader}>Repeat New Password:</Text>
                <TextInput
                    style={styles.input}
                    value={passwordInput2}
                    onChangeText={setPasswordInput2}
                    secureTextEntry
                    returnKeyType="done"
                />
                <TouchableOpacity onPress={handleProfileSave}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Save Profile Changes</Text>
                    </View>
                </TouchableOpacity>

                <View>
                    <Text>TEMP BUTTONS</Text>
                    <Button title="Reset Database" onPress={resetDatabase} />
                    <Button title="List Database" onPress={listDatabase} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        padding: 10,
    },
    inputHeader:{
        fontSize: 18,
    },
    input:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        backgroundColor: '#ffffffff',
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
});