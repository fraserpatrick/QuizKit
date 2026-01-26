import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function QuizPlayerSummary({ route }: any) {
    const { passedQuiz, questions, answers, score } = route.params;
    const percentage = (score/questions.length)*100;
    const navigation = useNavigation();

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
            {name: 'Home' as never},
            {name: 'QuizInfoScreen' as never, params: { passedQuiz: passedQuiz }},
            {name: 'QuizPlayer' as never, params: { passedQuiz: passedQuiz }}
        ],} as never);
    }


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
