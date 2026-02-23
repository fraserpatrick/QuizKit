import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Button, TextInput, Alert, Text } from 'react-native';
import { Quiz, User } from '@/app/components/Interfaces';
import { SegmentedButtons } from 'react-native-paper';
import { useAuth } from "@/app/AuthContext";
import PrimaryButtonWithIcon from "@/app/components/Button"; 
import { getOwnedQuizzes, getSharedQuizzes } from "@/api/quizzes";
import { LeaderboardItem, QuizItem } from "@/app/components/Items";
import { useSounds } from "@/app/hooks/useSounds";
import { getLeaderboard } from "@/api/users";
import { getLocalUsersQuizzes } from "@/localDatabase/quizzes";

export default function HomeScreen() {
    const navigation = useNavigation();
    const {username, logout} = useAuth();
    const {playNotification} = useSounds();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'QuizKit',
            headerLeft: () => (
                <Button title="Logout" onPress={handleLogout} />
            ),
            headerRight: () => (
                <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen' as never)} />
            ),
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
        }, []);


    const [localQuizzes, setLocalQuizzes] = useState<Quiz[]>([]);
    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
    const [sharedQuizzes, setSharedQuizzes] = useState<Quiz[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selector, setSelector] = useState('myQuizzes');
    const [search, setSearch] = useState('');
    const [leaderboard, setLeaderboard] = useState<User[]>([]);

    const loadQuizzes = async () => {
        try {
            const localQuizzes = await getLocalUsersQuizzes(username!);
            setLocalQuizzes(localQuizzes);
            const myQuizzes = await getOwnedQuizzes(username!);
            setMyQuizzes(myQuizzes);
            const sharedQuizzes = await getSharedQuizzes(username!);
            setSharedQuizzes(sharedQuizzes);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const loadLeaderboard = async () => {
        try {
            const leaderboardData = await getLeaderboard();
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadLeaderboard();
            if (!username) return;
            loadQuizzes();
        }, [username])
    );


    const handleLogout = () => {
        playNotification();
        Alert.alert(
            'Logout', 'Are you sure you want to logout?', [
                {text: 'No, stay logged in', style: 'cancel',},
                {text: 'Yes, logout', onPress: () => logout(), style: 'destructive',},
            ]
        );
    ;}

    const handleCreateQuiz = () => {
        navigation.navigate('QuizInfoEditor', {passedQuiz: null});
    }

    const handleOpenQuiz = (quiz: Quiz) => {
        navigation.navigate('QuizInfoScreen', { passedQuiz: quiz });
    };


    useEffect(() => {
        if (selector === 'myQuizzes') {
            setQuizzes([...myQuizzes, ...localQuizzes]);
        } else if (selector === 'sharedQuizzes') {
            setQuizzes(sharedQuizzes);
        }
    }, [selector, myQuizzes, sharedQuizzes, localQuizzes]);


    const searchedQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <View style={styles.container}>
            <PrimaryButtonWithIcon label="Create Quiz" onPress={handleCreateQuiz} icon="form"/>
            <View style={styles.quizContainer}>
                <SegmentedButtons
                    theme={{ colors: { secondaryContainer: '#007BFF', onSecondaryContainer: '#FFFFFF' } }}
                    value={selector}
                    onValueChange={setSelector}
                    buttons={[
                        { value: 'myQuizzes', label: 'My Quizzes', showSelectedCheck:true },
                        { value: 'sharedQuizzes', label: 'Shared Quizzes', showSelectedCheck:true }, 
                    ]}
                />
                <TextInput
                    style={styles.searchBar}
                    value={search}
                    onChangeText={setSearch}
                />
                <FlatList
                    data={searchedQuizzes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <QuizItem
                            quiz={item}
                            onPress={() => handleOpenQuiz(item)}
                        />
                    )}
                />
            </View>
            <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <FlatList
                    data={leaderboard}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item, index }) => (
                        <LeaderboardItem
                            user={item}
                            ranking={index + 1}
                            onPress={() => navigation.navigate('ProfileScreen', { passedUsername: item.username })}
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
        flex: 0.6,
        marginTop: 10,
        borderWidth: 1,
    },
    searchBar:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        backgroundColor: '#ffffffff',
    },
    leaderboardContainer:{
        flex: 0.4,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#cfcfcf',
        padding: 10,
    },
    leaderboardTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});