import { View, Text, Button } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import database from '@/DatabaseController';
import { useAuth } from '@/app/AuthContext';
import { useNavigation } from "@react-navigation/native";

export default function QuizPlayerSummary({ route }: any) {
    const { questions, answers } = route.params;
    const { username } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Summary',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            ),
        });
    }, [navigation]);


    const [score, setScore] = useState(0);

    useEffect(() => {
        const calcScoreAndUpdateStats = async () => {
            let total = 0;

            questions.forEach((question: any, index: number) => {
                if ( question.correctAnswer.trim().toLowerCase() === answers[index].trim().toLowerCase()) {
                    total++;
                }
            });

            setScore(total);

            try {
                await database.updateUserStats(username!, answers.length, total);
            } catch (error) {
                console.error('Error updating stats:', error);
            }
        }
        
        calcScoreAndUpdateStats();
    }, [questions, answers]);


    return (
        <View>
            <Text>
                Score: {score}/{questions.length}
            </Text>
        </View>
    );
}
