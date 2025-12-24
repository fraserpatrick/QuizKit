import { Text, Button, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '@/app/AuthContext';
import database, { Quiz, User } from '@/DatabaseController';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({route}: any) {
    const { username } = useAuth();
    const navigation = useNavigation();
    const passedUsername = route?.params?.passedUsername ?? username;

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



    const [quizzes, setQuizzes] = useState<Quiz[]>([]);


    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setQuizzes(await database.getUsersQuizzes(passedUsername));
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };
        

        loadQuizzes();
    }, []);

    type ItemProps = {
            quiz: Quiz;
            onPress: () => void;
        };
    
    const Item = ({ quiz, onPress }: ItemProps) => (
        <TouchableOpacity onPress={onPress} style={styles.quizItem}>
            <View>
                <Text style={styles.quizText}>{quiz.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleOpenQuiz = (quiz: Quiz) => {
        navigation.navigate('QuizInfoScreen' as never, { passedQuiz: quiz } as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.usernameHeader}>{passedUsername}'s Profile</Text>
            <View style={styles.statsContainer}>
                <Text style={styles.containerHeader}>Game Statistics</Text>
                <Text>Total Quizzes: {quizzes.length}</Text>
            </View>
            <View style={styles.quizContainer}>
                <Text style={styles.containerHeader}>Owned Quizzes</Text>
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
            <View >
                <Text>{'\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'}</Text>
                <Button title="Reset Database" onPress={resetDatabase} />
                <Button title="List Database" onPress={listDatabase} />
                <Text>Logged in as: {username}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        padding: 10,
    },
    usernameHeader:{
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 10,
    },
    statsContainer:{
        borderWidth: 2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0ff',
    },
    quizContainer:{
        borderWidth: 2,
        backgroundColor: '#e0e0e0ff',
        padding: 10,
    },
    containerHeader:{
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
    quizItem:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
    quizText:{
        textAlign: 'center',
        padding: 5,
        color: 'white',
        fontSize: 16,
    },
});