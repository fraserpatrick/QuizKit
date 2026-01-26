import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useState } from "react";
import { View, Text, Button, Alert, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import database, {Question} from '@/DatabaseController';
import { useAuth } from "@/app/AuthContext";

export default function QuizPlayer({route}: any) {
    const navigation = useNavigation();
    const { username } = useAuth();
    const {passedQuiz} = route.params;
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: quizStarted
                ? `Question ${currentQuestion + 1} of ${questions.length}`
                : `${passedQuiz.title}`,
            headerLeft: () => (
                <Button title="< Exit" onPress={handleExit} />
            )
        });
    }, [navigation, currentQuestion, quizStarted]);


    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState<string[]>([]);

    const loadQuestions = async () => {
        try {
            const questions = await database.getQuestionsByQuizID(passedQuiz.id!);
            setQuestions(questions);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadQuestions();
        }, [passedQuiz.id])
    );


    const handleExit = () => {
        if (quizStarted){
            Alert.alert( 'Exit Player', 'Are you ready to exit this quiz?', [
                {text: 'No, keep playing', style: 'cancel',},
                {text: 'Yes, exit quiz', onPress: () => navigation.goBack(), style: 'destructive',},
            ]);
        }
        else {
            navigation.goBack();
        }
    }

    const handleQuizStart = () => {
        if (questions.length === 0) {
            Alert.alert('No questions', 'This quiz has no questions.');
            return;
        }

        Alert.alert(
            'Start Quiz',
            'Are you ready to start this quiz?',
            [
                { text: 'Not yet', style: 'cancel' },
                { text: 'Yes, start playing', onPress: startQuiz }
            ]
        );
    };


    const startQuiz = () => {
        setQuizStarted(true);
    }

    const handleNextQuestion = () => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[currentQuestion] = answer;
            return updated;
        });

        setCurrentQuestion(prev => prev + 1);
        setAnswer(answers[currentQuestion + 1] ?? '');
    }

    const handlePrevQuestion = () => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[currentQuestion] = answer;
            return updated;
        });

        setCurrentQuestion(prev => prev - 1);
        setAnswer(answers[currentQuestion - 1] ?? '');
    }

    const calcScore = (questions: Question[], answers: string[]) => {
        let total = 0;

        questions.forEach((question: any, index: number) => {
            if ( question.correctAnswer.trim().toLowerCase() === answers[index].trim().toLowerCase()) {
                total++;
            }
        });

        return total;
    }

    const finishQuiz = async () => {
        const finalAnswers = [...answers];
        finalAnswers[currentQuestion] = answer;

        const score = calcScore(questions, finalAnswers);

        try {
            await database.updateUserStats(username!,questions.length,score);
        } catch (error) {
            console.error('Failed to update stats', error);
        }

        navigation.reset({
            index: 2,
            routes: [
                {name: 'Home' as never},
                {name: 'QuizInfoScreen' as never, params: { passedQuiz: passedQuiz }},
                {name: 'QuizPlayerSummary' as never, params: { passedQuiz: passedQuiz, questions: questions, answers: finalAnswers, score: score }}
            ],
        } as never);
    }


    const MultipleChoiceInput = ({options, value, onChange,}: {options: string[]; value: string; onChange: (val: string) => void;}) => {
        return (
            <View>
                {options.map(option => {
                    if (option){
                        const selected = value === option;

                        return (
                            <TouchableOpacity
                                key={option}
                                onPress={() => onChange(option)}
                                style={[styles.choiceButton, selected && styles.choiceButtonSelected,]}
                            >
                                <Text style={[styles.choiceText, selected && styles.choiceTextSelected,]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>
        );
    };

    const renderQuestion= (question: Question) => {
        switch (question.type) {
            case 'Single Answer':
                return (
                    <TextInput
                        style={styles.input}
                        value={answer}
                        onChangeText={setAnswer}
                    />
                );

            case 'Multiple Choice':
                return (
                    <MultipleChoiceInput
                        options={question.options}
                        value={answer}
                        onChange={setAnswer}
                    />
                );

            case 'True or False':
                return (
                    <MultipleChoiceInput
                        options={['True', 'False']}
                        value={answer}
                        onChange={setAnswer}
                    />
                );

            default:
                return null;
        }
    };

    return (<>
        {quizStarted ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionHeader}>{questions[currentQuestion].text}?</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        {renderQuestion(questions[currentQuestion])}
                    </View>
                    <View style={styles.buttonsContainer}>
                        {currentQuestion < questions.length -1 ? (
                            <TouchableOpacity onPress={handleNextQuestion} >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Next Question</Text>
                                </View>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity onPress={finishQuiz} >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Finish Quiz</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {currentQuestion !== 0 && (
                            <TouchableOpacity  onPress={handlePrevQuestion}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Previous Question</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        ) : (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleQuizStart} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Start Quiz</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.questionHeader}>Number of questions: {questions.length}</Text>
            </View>
        )}
    </>);
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    questionContainer:{
        flex: 0.2,
        borderWidth: 1,
        padding: 10,
        margin: 10,
        backgroundColor: '#cececeff'
    },
    inputContainer:{
        flex: 0.6,
        borderWidth: 1,
        padding: 10,
        margin: 10,
        backgroundColor: '#cececeff'
    },
    buttonsContainer:{
        flex: 0.2,
        margin: 10,
    },
    questionHeader:{
        fontSize: 20,
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
    input:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        backgroundColor: '#ffffffff',
    },
    bigInput:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        backgroundColor: '#ffffffff',
        height: 150,
    },
    choiceButton: {
        padding: 10,
        marginVertical: 6,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#ffffff',
    },
    choiceButtonSelected: {
        backgroundColor: '#7a7a7aff',
    },
    choiceText: {
        fontSize: 18,
        color: '#000000',
        textAlign: 'center',
    },
    choiceTextSelected: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});