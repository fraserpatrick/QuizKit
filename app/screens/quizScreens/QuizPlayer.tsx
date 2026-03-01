import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Button, Alert, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Pressable } from "react-native";
import { Question } from '@/components/Interfaces';
import { useAuth } from "@/context/AuthContext";
import { PrimaryButtonWithIcon, PrimaryButtonWithIconRight } from "@/components/Buttons";
import { getQuizQuestions } from "@/api/questions";
import { updateStats } from "@/api/users";
import { useSounds } from "@/hooks/useSounds";
import { getLocalQuizQuestions } from "@/localDatabase/questions";

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
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);


    const loadQuestions = async () => {
        try {
            if (passedQuiz.saveType === 'local'){
                setQuestions(await getLocalQuizQuestions(passedQuiz.id!));
            } else if (passedQuiz.saveType === 'cloud'){
                setQuestions(await getQuizQuestions(passedQuiz.id!));
            }
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
            {name: 'QuizPlayerSummary', params: { passedQuiz: passedQuiz, questions: updatedQuestions, score: score, points: points }}
        ],} as never);
    }


    function parseOptions(raw: unknown): string[] {
        if (!raw) {
            return [];
        }

        if (Array.isArray(raw)) {
            return raw;
        }

        if (typeof raw === "string") {
            try {
                const parsed = JSON.parse(raw);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            } catch {
                return [raw];
            }
        }
        return [];
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


    const MultipleSelectInput = ({options, value, onChange,}: {options: string[]; value: string; onChange: (val: string) => void}) => {
        let selected: string[] = [];

        try {
            selected = value ? JSON.parse(value) : []
        } catch {
            selected = []
        }
        const toggle = (option: string) => {
            let updated = [...selected]
            if (updated.includes(option)) {
                updated = updated.filter(opt => opt !== option)
            } else {
                updated.push(option)
            }

            onChange(JSON.stringify(updated))
        }
        return (
            <View>
                {options.map(option => {
                    const isSelected = selected.includes(option);

                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => toggle(option)}
                            style={[styles.choiceButton, isSelected && styles.choiceButtonSelected,]}
                        >
                            <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected,]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                }
                )}
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
                        options={parseOptions(question.mcOptions)}
                        value={answer}
                        onChange={setAnswer}
                    />
                );

            case 'Multiple Select':
                return (
                    <MultipleSelectInput
                        options={parseOptions(question.mcOptions)}
                        value={answer}
                        onChange={setAnswer}
                    />
                )

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


    const QuizImage = ({ imageUri, saveType }: { imageUri: string; saveType: 'cloud' | 'local' }) => {
        if (!imageUri) {
            return null;
        }

        let uri = imageUri;
        const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

        if (saveType === 'cloud') {
            uri = baseUrl + 'uploads/' + imageUri;
        }

        return (
            <TouchableOpacity onPress={() => setImagePreviewVisible(true)} activeOpacity={0.8}>
                <Image 
                    source={{ uri }}
                    style={styles.image}
                />
            </TouchableOpacity>
        )
    }; 


    return (<>
        {quizStarted ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={{paddingBottom: 140}}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionHeader}>{questions[currentQuestion].text}?</Text>
                            <QuizImage
                                imageUri={questions[currentQuestion].imageUri}
                                saveType={passedQuiz.saveType}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            {renderQuestion(questions[currentQuestion])}
                        </View>
                    </ScrollView>
                        <View style={styles.floatingButtons}>
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

        <Modal visible={imagePreviewVisible} transparent={true} animationType="fade">
            <Pressable style={styles.modalContainer} onPress={() => setImagePreviewVisible(false)}>
                {questions[currentQuestion]?.imageUri && (
                    <Image 
                        source={{uri: passedQuiz.saveType === 'cloud'
                            ? `${process.env.EXPO_PUBLIC_API_BASE_URL ?? ''}uploads/${questions[currentQuestion].imageUri}`
                            : questions[currentQuestion].imageUri}}
                        style={styles.fullImage} 
                        resizeMode="contain" 
                    />
                )}
            </Pressable>
        </Modal>
    </>);
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 20
    },
    questionContainer:{
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#cecece',
        borderRadius: 10,
    },
    questionHeader:{
        fontSize: 20,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    inputContainer:{
        flex: 1,
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#cecece',
        borderRadius: 10,
    },
    input:{
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    choiceButton:{
        padding: 10,
        marginVertical: 6,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#fff',
    },
    choiceButtonSelected:{
        backgroundColor: '#FF6B00',
    },
    choiceText:{
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
    },
    choiceTextSelected:{
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    floatingButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 15,
    }
});