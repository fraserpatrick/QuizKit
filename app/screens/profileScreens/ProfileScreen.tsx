import { Text, View, StyleSheet, FlatList, Alert, Button } from 'react-native';
import { useAuth } from '@/app/AuthContext';
import { Quiz, User } from '@/DatabaseController';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '@/app/components/Button';
import { getOwnedQuizzes } from '@/api/quizzes';
import { getUserByUsername } from '@/api/users';
import { SmallQuizItem } from '@/app/components/QuizAndQuestionItem';

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
    const [user, setUser] = useState<User>({email: '', username: '', totalQuizPlays: 0, totalAnswers: 0, totalCorrect: 0});
    const ownProfile = passedUsername === username;


    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setQuizzes(await getOwnedQuizzes(passedUsername));
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        };

        const loadUser = async () => {
            try {
                const result = await getUserByUsername(passedUsername);
                setUser(result);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        loadQuizzes();
        loadUser();
    }, []);



    return (
        <View style={styles.container}>
            <View style={styles.usernameContainer}>
                <Text style={styles.usernameHeader}>{passedUsername}'s Profile</Text>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.containerHeader}>Game Statistics</Text>
                <Text>Total Quizzes: {user.totalQuizPlays}</Text>
                <Text>Total Questions Answered: {user.totalAnswers}</Text>
                <Text>Total Questions Correct: {user.totalCorrect}</Text>
            </View>
            <View style={styles.quizContainer}>
                <Text style={styles.containerHeader}>Owned Quizzes</Text>
                <FlatList
                    data={quizzes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <SmallQuizItem
                            quiz={item}
                            onPress={() => navigation.navigate('QuizInfoScreen', { passedQuiz: item })}
                        />
                    )}
                />
            </View>
            {ownProfile && (
                <View style={styles.buttonContainer}>
                    <PrimaryButton label="Edit Profile" onPress={() => navigation.navigate('ProfileEditor')}/>
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
    buttonContainer:{
        flex: 0.1,
    },
});