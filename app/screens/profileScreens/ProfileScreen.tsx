import { Text, View, StyleSheet, FlatList, Button, Dimensions } from 'react-native';
import { useAuth } from '@/app/AuthContext';
import { Quiz, User } from '@/DatabaseController';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getOwnedQuizzes } from '@/api/quizzes';
import { getUserByUsername } from '@/api/users';
import { SmallQuizItem } from '@/app/components/QuizAndQuestionItem';
import * as Progress from 'react-native-progress';

export default function ProfileScreen({route}: any) {
    const { username } = useAuth();
    const navigation = useNavigation();
    const passedUsername = route?.params?.passedUsername ?? username;
    const screenWidth = Dimensions.get('window').width;

    useLayoutEffect(() => {
        const options: any = {
            title: passedUsername === username ? 'My Profile' : `${passedUsername}'s Profile`,
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            ),
        };

        if (username === passedUsername) {
            options.headerRight = () => (
                <Button title="Edit Profile" onPress={() => navigation.navigate('ProfileEditor')} />
            );
        }

        navigation.setOptions(options);
    }, [navigation, username, passedUsername]);


    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [user, setUser] = useState<User>({email: '', username: '', totalQuizPlays: 0, totalAnswers: 0, totalCorrect: 0, points: 0});


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
    
    const lowerBound = 40;
    const upperBound = 80;
    const progress = (user.points - lowerBound) / (upperBound - lowerBound);


    return (
        <View style={styles.container}>
            <View style={styles.pointsContainer}>
                <Progress.Bar progress={progress} width={screenWidth - 40} height={20} borderRadius={10} color="#FF6B00" borderColor="#000000" borderWidth={2} />
                <View style={styles.pointsLabels}>
                    <Text>{lowerBound}</Text>
                    <Text>{user.points}</Text>
                    <Text>{upperBound}</Text>
                </View>
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
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
    },
    pointsContainer:{
        flex: 0.2,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0ff',
    },
    pointsLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    statsContainer:{
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0ff',
        flex: 0.2,
    },
    quizContainer:{
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#e0e0e0ff',
        padding: 10,
        flex: 0.5,
    },
    containerHeader:{
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
});