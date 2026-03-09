import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Quiz, User } from '@/components/Interfaces';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getOwnedQuizzes } from '@/api/quizzes';
import { getUserByUsername } from '@/api/users';
import { SmallQuizItem } from '@/components/Items';
import * as Progress from 'react-native-progress';
import { SecondaryColour } from '@/components/SelectedStyles';
import { HeaderButton } from '@/components/Buttons';

export default function ProfileScreen({route}: any) {
    const { username } = useAuth();
    const navigation = useNavigation();
    const passedUsername = route?.params?.passedUsername ?? username;
    const screenWidth = Dimensions.get('window').width;

    useLayoutEffect(() => {
        const options: any = {
            title: passedUsername === username ? 'My Profile' : `${passedUsername}'s Profile`,
            headerLeft: () => (
                <HeaderButton label="Back" icon='caret-left' onPress={navigation.goBack} />
            ),
        };

        if (username === passedUsername) {
            options.headerRight = () => (
                <HeaderButton label="Edit" icon='edit' onPress={() => navigation.navigate('ProfileEditor')} />
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

    const calculateBounds = (points: number) => {  
        let level = 1;
        let upperBound = 10;

        while (points >= upperBound) {
            level++;
            if (level <= 5) {
                upperBound *= 2;
            } else {
                upperBound = Math.floor(upperBound * 1.5);
            }
        }

        let lowerBound = 0;
        if (level === 1) {
            lowerBound = 0;
        } else if (level <= 5) {
            lowerBound = upperBound / 2;
        } else {
            lowerBound = Math.floor(upperBound / 1.5);
        }

        return {
            level,
            lowerBound,
            upperBound,
        };
    }
    
    const { level, lowerBound, upperBound } = calculateBounds(user.points);



    const progress = Math.min(Math.max((user.points - lowerBound) / (upperBound - lowerBound), 0),1);
    const [pointsTextWidth, setPointsTextWidth] = useState(0);
    const barWidth = screenWidth - 40;
    const pointsCalculatedLeft = progress * barWidth - pointsTextWidth - 6;
    const pointClampedLeft = Math.min(Math.max(pointsCalculatedLeft, 4),barWidth - pointsTextWidth - 4);


    const accuracy = Math.min(Math.max((user.totalCorrect/user.totalAnswers), 0),1);
    const [accuracyTextWidth, setAccuracyTextWidth] = useState(0);
    const accuracyCalculatedLeft = accuracy * barWidth - accuracyTextWidth - 6;
    const accuracyClampedLeft = Math.min(Math.max(accuracyCalculatedLeft, 4),barWidth - accuracyTextWidth - 4);

    return (
        <View style={styles.container}>
            <View style={styles.pointsContainer}>
                <Text style={styles.containerHeader}>
                    Level {level}
                </Text>
                <View style={styles.progressWrapper}>
                    <Progress.Bar
                        progress={progress}
                        width={barWidth}
                        height={24}
                        borderRadius={12}
                        color={SecondaryColour}
                        borderColor="#000000"
                        borderWidth={2}
                    />
                    <Text
                        onLayout={(e) => setPointsTextWidth(e.nativeEvent.layout.width)}
                        style={[styles.pointsInside,{left: pointClampedLeft,},]}
                    >
                        {user.points} points
                    </Text>
                </View>
                <View style={styles.pointsLabels}>
                    <Text>{lowerBound}</Text>
                    <Text>{upperBound}</Text>
                </View>
            </View>
            <View style={styles.statsContainer}>
                <Text style={styles.containerHeader}>Game Statistics</Text>
                <Text>Total Quizzes: {user.totalQuizPlays}</Text>
                <Text>Total Questions Answered: {user.totalAnswers}</Text>
                <Text>Total Questions Correct: {user.totalCorrect}</Text>
                <Text style={styles.accuracyHeader}>Accuracy</Text>
                <View style={styles.progressWrapper && {marginVertical: 5}}>
                    <Progress.Bar
                        key={accuracy}
                        progress={accuracy}
                        width={barWidth}
                        height={24}
                        borderRadius={12}
                        color={SecondaryColour}
                        borderColor="#000000"
                        borderWidth={2}
                    />
                    <Text
                        onLayout={(e) => setAccuracyTextWidth(e.nativeEvent.layout.width)}
                        style={[styles.pointsInside,{left: accuracyClampedLeft,},]}
                    >
                        {!Number.isNaN(accuracy) ? (accuracy*100).toFixed(0) : 0}%
                    </Text>
                </View>
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
        flex: 0.15,
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0',
    },
    progressWrapper: {
        position: 'relative',
        alignItems: 'center',
    },
    pointsInside: {
        position: 'absolute',
        top : 5,
        fontWeight: 'bold',
    },
    pointsLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    statsContainer:{
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#e0e0e0',
        flex: 0.27,
    },
    quizContainer:{
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: '#e0e0e0',
        padding: 10,
        flex: 0.5,
    },
    containerHeader:{
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    accuracyHeader: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16
    }
});