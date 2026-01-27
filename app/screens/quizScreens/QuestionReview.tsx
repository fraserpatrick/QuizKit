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
    

    return(
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text style={styles.questionHeader}> {question.text}</Text>
            </View>
            <View style={styles.answerContainer}>
                <Text> Your Answer </Text>
                <Text> {question.userAnswer} </Text>
                <Text> Correct Answer </Text>
                <Text> {question.correctAnswer} </Text>
            </View>
            <View style={styles.feedbackContainer}>
                <Text> RANDOM FEEDBACK </Text>
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
        flex: 0.2,
    },
    questionHeader:{
        fontSize: 20,
    },
    answerContainer:{
        flex: 0.2,
    },
    feedbackContainer:{
        flex: 0.4,
    },
});