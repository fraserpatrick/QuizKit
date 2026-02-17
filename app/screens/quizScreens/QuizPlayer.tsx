import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Button, Alert, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import {Question} from '@/DatabaseController';
import { useAuth } from "@/app/AuthContext";
import { PrimaryButtonWithIcon, PrimaryButtonWithIconRight } from "@/app/components/Button";
import { getQuizQuestions } from "@/api/questions";
import { updateStats } from "@/api/users";
import { useSounds } from "@/app/hooks/useSounds";

export default function QuizPlayer({route}: any) {
    const navigation = useNavigation();
    const { username } = useAuth();
    const {passedQuiz} = route.params;
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const {playNotification} = useSounds();

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

    const loadQuestions = async () => {
        try {
            const questions = await getQuizQuestions(passedQuiz.id!);
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

    useEffect(() => {
        setAnswer(questions[currentQuestion]?.userAnswer ?? '');
    }, [currentQuestion, questions]);


    const handleExit = () => {
        if (quizStarted){
            playNotification();
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

        playNotification();
        Alert.alert(
            'Start Quiz',
            'Are you ready to start this quiz?',
            [
                { text: 'Not yet', style: 'cancel' },
                { text: 'Yes, start playing', onPress:startQuiz }
            ]
        );
    };


    const startQuiz = () => {
        setQuizStarted(true);
    }

    const saveAnswer = (quesiton: number, answer: string) => {
        setQuestions(prev => {
            const updated = [...prev];
            updated[quesiton] = {
                ...updated[quesiton],
                userAnswer: answer
            };
            return updated;
        });
    };

    const handleNextQuestion = () => {
        saveAnswer(currentQuestion, answer);
        setCurrentQuestion(prev => prev + 1);
    }

    const handlePrevQuestion = () => {
        saveAnswer(currentQuestion, answer);
        setCurrentQuestion(prev => prev - 1);
    }

    const calcScore = (questions: Question[]) => {
        let total = 0;

        questions.forEach((question: Question) => {
            if ( question.userAnswer && question.correctAnswer.trim().toLowerCase() === question.userAnswer.trim().toLowerCase()) {
                total++;
            }
        });

        return total;
    }

    const finishQuiz = async () => {
        const updatedQuestions = [...questions];

        updatedQuestions[currentQuestion] = {
            ...updatedQuestions[currentQuestion],
            userAnswer: answer,
        };

        const score = calcScore(updatedQuestions);
        const points = score * 10 + (score === questions.length ? 25 : 0);

        try {
            await updateStats(username!,updatedQuestions.length,score,points);
        } catch (error) {
            console.error('Failed to update stats', error);
        }

        navigation.reset({index: 2, routes: [
            {name: 'Home'},
            {name: 'QuizInfoScreen', params: { passedQuiz: passedQuiz }},
            {name: 'QuizPlayerSummary', params: { passedQuiz: passedQuiz, questions: updatedQuestions, score: score }}
        ],} as never);
    }


    const MultipleChoiceInput = ({options, value, onChange,}: {options: string[]; value: string; onChange: (val: string) => void;}) => {
        if (options && !(options.length === 2 && options[0] === "True" && options[1] === "False")) {
            try {
                const parsed: unknown = JSON.parse(options.toString());
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                    options = parsed;
                } 
            } catch (error) {
                console.error('Invalid JSON:', error);
            }
        }
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
                            <PrimaryButtonWithIconRight label="Next Question" icon="forward" onPress={handleNextQuestion}/>
                        ):(
                            <PrimaryButtonWithIcon label="Finish Quiz" icon="check-circle" onPress={finishQuiz}/>
                        )}
                        {currentQuestion !== 0 && (
                            <PrimaryButtonWithIcon label="Previous Question" icon="backward" onPress={handlePrevQuestion}/>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        ) : (
            <View style={styles.container}>
                <PrimaryButtonWithIcon label="Start Quiz" icon="play-circle" onPress={handleQuizStart}/>
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
        backgroundColor: '#FF6B00',
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