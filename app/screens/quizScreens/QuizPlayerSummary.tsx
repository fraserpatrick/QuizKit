import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {Question} from '@/DatabaseController';
import PrimaryButton, { PrimaryButtonWithIcon, PrimaryButtonWithIconRight } from "@/app/components/Button";
import { VariableQuestionItem } from "@/app/components/QuizAndQuestionItem";
import { useSounds } from "@/app/hooks/useSounds";

export default function QuizPlayerSummary({ route }: any) {
    const { passedQuiz, questions, score } = route.params;
    const percentage = (score/questions.length)*100;
    const navigation = useNavigation();
    const { playFanfare } = useSounds();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Results Summary',
            headerLeft: () => (
                <Button title="< Exit" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home' as never}],} as never)} />
            ),
        });
    }, [navigation]);


    const handlePlayAgain = () => {
        navigation.reset({index: 2, routes: [
            {name: 'Home'},
            {name: 'QuizInfoScreen', params: { passedQuiz: passedQuiz }},
            {name: 'QuizPlayer', params: { passedQuiz: passedQuiz }}
        ],} as never);
    }

    const correct = (question: Question) => {
        return (question.correctAnswer.trim().toLowerCase() === question.userAnswer?.trim().toLowerCase())
    }

    useEffect(() => {
        playFanfare();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.resultsContainer}>
                <AnimatedCircularProgress
                    size={170}
                    width={25}
                    fill={percentage}
                    tintColor="#00c400"
                    backgroundColor="#ff0000"
                    rotation={0}
                    lineCap="round">
                    {() => (<>
                        <Text style={styles.resultsText}>
                            {percentage.toFixed(0)}%
                        </Text>
                        <Text style={styles.resultsText}>
                            {score}/{questions.length}
                        </Text>
                    </>)}
                </AnimatedCircularProgress>
            </View>
            <View style={styles.questionsContainer}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <VariableQuestionItem
                            question={item}
                            onPress={() => navigation.navigate('QuestionReview', {question: item})}
                            correct={correct(item)}
                        />
                    )}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <PrimaryButtonWithIconRight label="Play Again" icon="reload" onPress={handlePlayAgain}/>
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
    resultsContainer:{
        flex: 0.3,
        alignContent: 'center',
        alignItems: 'center'
    },
    resultsText:{
        fontSize: 24,
    },
    questionsContainer:{
        flex: 0.5,
    },
    questionItem:{
        alignItems: 'center',
        backgroundColor: '#db0000',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
    correctItem:{
        backgroundColor: '#00c400ff',
    },
    buttonsContainer:{
        flex: 0.2,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
})
