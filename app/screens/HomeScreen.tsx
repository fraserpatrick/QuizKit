import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Button, TextInput, Alert, Text, ActivityIndicator } from 'react-native';
import { Quiz, User } from '@/components/Interfaces';
import { SegmentedButtons } from 'react-native-paper';
import { useAuth } from "@/context/AuthContext";
import { PrimaryButtonWithIcon } from "@/components/Buttons"; 
import { getOwnedQuizzes, getSharedQuizzes } from "@/api/quizzes";
import { LeaderboardItem, OwnedQuizItem, QuizItem } from "@/components/Items";
import { useSounds } from "@/hooks/useSounds";
import { getLeaderboard } from "@/api/users";
import { getLocalUsersQuizzes } from "@/localDatabase/quizzes";
import { MaterialIcons } from '@expo/vector-icons';
import { PrimaryColour, SecondaryColour } from "@/components/SelectedStyles";
import { DestructiveModal } from "@/components/Modal";


export default function HomeScreen() {
    const navigation = useNavigation();
    const {username, logout} = useAuth();
    const {playNotification} = useSounds();
    const [loading, setLoading] = useState<boolean>(true);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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

    const fetchData = async () => {
            try {
                setLoading(true);
                await loadLeaderboard();

                if (username) {
                    await loadQuizzes();
                }
            } catch (error) {
                console.error('Error loading home data:', error);
            } finally {
                setLoading(false);
            }
        };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [username])
    );


    const handleLogout = () => {
        playNotification();
        setLogoutModalVisible(true);
    ;}

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        logout();
    };

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


    if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={SecondaryColour} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            );
        }

    return (
        <View style={styles.container}>
            <PrimaryButtonWithIcon label="Create Quiz" onPress={handleCreateQuiz} icon="form"/>
            <View style={styles.quizContainer}>
                <SegmentedButtons
                    theme={{ colors: { secondaryContainer: PrimaryColour, onSecondaryContainer: '#FFFFFF' } }}
                    value={selector}
                    onValueChange={setSelector}
                    buttons={[
                        { value: 'myQuizzes', label: 'My Quizzes', showSelectedCheck:true },
                        { value: 'sharedQuizzes', label: 'Shared Quizzes', showSelectedCheck:true }, 
                    ]}
                />

                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search quizzes"
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                        clearButtonMode="while-editing"
                    />
                </View>
                <FlatList
                    data={searchedQuizzes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        selector === "myQuizzes" ? (
                            <OwnedQuizItem
                                quiz={item}
                                onPress={() => handleOpenQuiz(item)}
                            />
                        ) : (
                            <QuizItem
                                quiz={item}
                                onPress={() => handleOpenQuiz(item)}
                            />
                        )
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
                            loggedIn={username === item.username}
                        />
                    )}
                />
            </View>
            <DestructiveModal
                visible={logoutModalVisible}
                titleText='Logout'
                infoText='Are you sure you want to logout?'
                cancelText='No, stay logged in'
                confirmText='Yes, logout'
                onClose={() => setLogoutModalVisible(false)}
                onConfirm={confirmLogout}
            />
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
        borderRadius: 10,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    leaderboardContainer:{
        flex: 0.4,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    leaderboardTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
},
});