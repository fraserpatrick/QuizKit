import { Text, View, TouchableOpacity, StyleSheet, FlatList, Alert, Button } from 'react-native';
import { useAuth } from '@/app/AuthContext';
import database, { Quiz, User } from '@/DatabaseController';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({route}: any) {
    const { username, logout } = useAuth();
    const navigation = useNavigation();
    const passedUsername = route?.params?.passedUsername ?? username;

    useLayoutEffect(() => {
        const options: any = {
            title: 'Profile',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            ),
        };

        if (username === passedUsername) {
            options.headerRight = () => (
                <Button title="Logout" onPress={handleLogout} />
            );
        }

        navigation.setOptions(options);
    }, [navigation, username, passedUsername]);

    const handleLogout = () => Alert.alert(
        'Logout', 'Are you sure you want to logout?', [
            {text: 'No, stay logged in', style: 'cancel',},
            {text: 'Yes, logout', onPress: () => logout(), style: 'destructive',},
        ]
    );

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [user, setUser] = useState<User>({email: '', username: '', totalQuizPlays: 0, totalQuestionsAnswered: 0, totalQuestionsCorrect: 0});
    const ownProfile = passedUsername === username;


    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setQuizzes(await database.getUsersQuizzes(passedUsername));
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };

        const loadUser = async () => {
            try {
                const users = await database.getUserByUsername(passedUsername);
                setUser(users[0]);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        loadQuizzes();
        loadUser();
    }, []);

    type ItemProps = {
            quiz: Quiz;
            onPress: () => void;
        };
    
    const Item = ({ quiz, onPress }: ItemProps) => (
        <TouchableOpacity onPress={onPress} style={styles.quizItem}>
            <View>
                <Text style={styles.quizText}>{quiz.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleOpenQuiz = (quiz: Quiz) => {
        navigation.navigate('QuizInfoScreen' as never, { passedQuiz: quiz } as never);
    };


    return (
        <View style={styles.container}>
            <View style={styles.usernameContainer}>
                <Text style={styles.usernameHeader}>{passedUsername}'s Profile</Text>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.containerHeader}>Game Statistics</Text>
                <Text>Total Quizzes: {user.totalQuizPlays}</Text>
                <Text>Total Questions Answered: {user.totalQuestionsAnswered}</Text>
                <Text>Total Questions Correct: {user.totalQuestionsCorrect}</Text>
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
            {ownProfile && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileEditor' as never)} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        padding: 10,
    },
    usernameContainer:{
        flex: 0.07,
        padding: 5,
    },
    usernameHeader:{
        fontSize: 32,
        textAlign: 'center',
    },
    statsContainer:{
        borderWidth: 2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0ff',
        flex: 0.2,
    },
    quizContainer:{
        borderWidth: 2,
        backgroundColor: '#e0e0e0ff',
        padding: 10,
        flex: 0.7,
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
    buttonContainer:{
        flex: 0.1,
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