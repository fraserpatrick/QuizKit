import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, Button } from 'react-native';
import database, { Question } from '@/DatabaseController';
import { useState, useCallback, useLayoutEffect } from 'react';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Settings"
                    onPress={() =>
                        navigation.navigate('QuizInfoEditor', { passedQuiz })
                    }
                />
            ),
        });
    }, [navigation, passedQuiz]);

    const [questions, setQuestions] = useState<Question[]>([]);

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

    type ItemProps = {
            question: Question;
            onPress: () => void;
        };
    
        const Item = ({ question, onPress }: ItemProps) => (
            <TouchableOpacity onPress={onPress} style={styles.questionItem}>
                <View>
                    <Text style={styles.buttonText}>{question.text}</Text>
                </View>
            </TouchableOpacity>
        );

    const handleCreateQuestions = () => {
        navigation.navigate('QuestionEditor', { passedQuestion: null, passedQuiz: passedQuiz } as never);
    };

    const handleOpenQuestion = (question: Question) => {
        navigation.navigate('QuestionEditor', { passedQuestion: question, passedQuiz: passedQuiz } as never);
    }


    return (
        <View style={styles.container}>
            <View style={styles.questionsContainer}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <Item
                            question={item}
                            onPress={() => handleOpenQuestion(item)}
                        />
                    )}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleCreateQuestions} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Create new question</Text>
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
    questionsContainer:{
        flex: 0.9,
    },
    buttonsContainer:{
        flex: 0.1,
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
    questionItem:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
});