import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import database, { User } from '@/DatabaseController';
import { useAuth } from '@/app/AuthContext';

export default function QuizPlayerSummary({ route }: any) {
    const { questions, answers } = route.params;
    const { username } = useAuth();

    const [user, setUser] = useState<User>();
    const [score, setScore] = useState(0);
    const [statsUpdated, setStatsUpdated] = useState(false);

    useEffect(() => {
        let total = 0;

        questions.forEach((question: any, index: number) => {
            if (question.correctAnswer === answers[index]) {
                total++;
            }
        });

        setScore(total);
    }, [questions, answers]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const users = await database.getUserByUsername(username!);
                setUser(users[0]);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };

        loadUser();
    }, [username]);

    useEffect(() => {
        if (!user || statsUpdated) return;

        const updateStats = async () => {
            try {
                await database.updateUserStats(
                    username!,
                    user.totalQuizPlays + 1,
                    user.totalQuestionsAnswered + answers.length,
                    user.totalQuestionsCorrect + score
                );

                setStatsUpdated(true);
            } catch (error) {
                console.error('Error updating stats:', error);
            }
        };

        updateStats();
    }, [user, score, answers.length, username, statsUpdated]);

    return (
        <View>
            <Text>
                Score: {score}/{questions.length}
            </Text>
        </View>
    );
}
