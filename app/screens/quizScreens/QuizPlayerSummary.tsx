import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import database from '@/DatabaseController';
import { useAuth } from '@/app/AuthContext';
import { useNavigation } from "@react-navigation/native";

export default function QuizPlayerSummary({ route }: any) {
    const { passedQuiz, questions, answers } = route.params;
    const { username } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Results Summary',
            headerLeft: () => (
                <Button title="< Exit" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home' as never}],} as never)} />
            ),
        });
    }, [navigation]);


    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const calcScoreAndUpdateStats = async () => {
            let total = 0;

            questions.forEach((question: any, index: number) => {
                if ( question.correctAnswer.trim().toLowerCase() === answers[index].trim().toLowerCase()) {
                    total++;
                }
            });

            setScore(total);
            setPercentage((total/questions.length)*100);

            try {
                await database.updateUserStats(username!, answers.length, total);
            } catch (error) {
                console.error('Error updating stats:', error);
            }
        }
        
        calcScoreAndUpdateStats();
    }, [questions, answers]);


    const handlePlayAgain = () => {
        navigation.reset({index: 2, routes: [
            {name: 'Home' as never},
            {name: 'QuizInfoScreen' as never, params: { passedQuiz: passedQuiz }},
            {name: 'QuizPlayer' as never, params: { passedQuiz: passedQuiz }}
        ],} as never);
    }


    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <Text>
                    Score: {score}/{questions.length}
                </Text>
                <Text>
                    {percentage}%
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handlePlayAgain} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Play Again</Text>
                    </View>
                </TouchableOpacity>
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
    mainContainer:{
        flex: 0.8,
    },
    buttonsContainer:{
        flex: 0.2,
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
})
