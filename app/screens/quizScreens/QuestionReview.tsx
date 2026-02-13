import { useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function QuizPlayerSummary({ route }: any) {
    const {question} = route.params;
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Question Summary',
            headerLeft: () => (
                <Button title="< Back" onPress={() => navigation.goBack()} />
            ),
        });
    }, [navigation]);
    const feedback = question.feedback || "No feedback provided.";
    const correct = question.correctAnswer == question.userAnswer;


    return(
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text style={styles.questionHeader}> {question.text}?</Text>
            </View>
            <View style={styles.answerContainer}>
                <View style={styles.innerAnswerContainer}>
                    <Text style={styles.answerHeader}> Your Answer </Text>
                    <Text> {question.userAnswer} </Text>
                </View>
                {!correct && (
                    <View style={styles.innerAnswerContainer}>
                        <Text style={styles.answerHeader}> Correct Answer </Text>
                        <Text> {question.correctAnswer} </Text>
                    </View>
                )}
                {correct && (
                    <View style={styles.innerAnswerContainer}>
                        <Text style={styles.answerHeader}> Correct! </Text>
                    </View>
                )}
            </View>
            <View style={styles.feedbackContainer}>
                    <Text style={styles.answerHeader}> Feedback </Text>
                <Text> {feedback} </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create ({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    questionContainer:{
        flex: 0.15,
        borderWidth: 1,
        padding: 10,
        margin: 10
    },
    questionHeader:{
        fontSize: 20,
    },
    answerContainer:{
        flex: 0.2,
        borderWidth: 1,
        margin: 10,
    },
    innerAnswerContainer:{
        padding: 10,
    },
    answerHeader:{
        fontSize: 20,
    },
    feedbackContainer:{
        flex: 0.4,
        borderWidth: 1,
        padding: 10,
        margin: 10
    },
});