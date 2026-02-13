import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Button } from 'react-native';
import { Question } from '@/DatabaseController';
import { useState, useCallback, useLayoutEffect } from 'react';
import PrimaryButton from '@/app/components/Button';
import { getQuizQuestions } from '@/api/questions';
import { QuestionItem } from '@/app/components/QuizAndQuestionItem';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Editing: ${passedQuiz.title}`,
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            )
        });
    }, []);

    const [questions, setQuestions] = useState<Question[]>([]);

    const loadQuestions = async () => {
            try {
                setQuestions(await getQuizQuestions(passedQuiz.id!));
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
    
    useFocusEffect(
        useCallback(() => {
            loadQuestions();
        }, [passedQuiz.id])
    );


    const handleCreateQuestions = () => {
        navigation.navigate('QuestionEditor', { passedQuestion: null, passedQuiz: passedQuiz });
    };

    const handleOpenQuestion = (question: Question) => {
        navigation.navigate('QuestionEditor', { passedQuestion: question, passedQuiz: passedQuiz });
    }


    return (
        <View style={styles.container}>
            <View style={styles.questionsContainer}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <QuestionItem
                            question={item}
                            onPress={() => handleOpenQuestion(item)}
                        />
                    )}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <PrimaryButton label="Create new question" onPress={handleCreateQuestions}/>
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
});