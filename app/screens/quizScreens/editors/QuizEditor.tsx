import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Button, Text } from 'react-native';
import { Question } from '@/components/Interfaces';
import { useState, useCallback, useLayoutEffect } from 'react';
import { PrimaryButtonWithIcon } from '@/components/Buttons';
import { getQuizQuestions } from '@/api/questions';
import { getLocalQuizQuestions } from '@/localDatabase/questions';
import { QuestionItem } from '@/components/Items';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Editing: ${passedQuiz.title}`,
            headerLeft: () => (
                <Button title="< Back" onPress={() => navigation.goBack()} />
            )
        });
    }, [navigation, passedQuiz.title]);

    const [questions, setQuestions] = useState<Question[]>([]);

    const loadQuestions = async () => {
            try {
                if (passedQuiz.saveType === 'local'){
                    const localQuestions = await getLocalQuizQuestions(passedQuiz.id!);
                    setQuestions(localQuestions)
                } else if (passedQuiz.saveType === 'cloud'){
                    const cloudQuestions = await getQuizQuestions(passedQuiz.id!)
                    setQuestions(cloudQuestions);
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
                    contentContainerStyle={{paddingBottom: 60}}
                    renderItem={({ item }) => (
                        <QuestionItem
                            question={item}
                            onPress={() => handleOpenQuestion(item)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No questions yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Tap "Create new question" to start building your quiz.
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <PrimaryButtonWithIcon label="Create new question" icon="plus" onPress={handleCreateQuestions}/>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    questionsContainer:{
        flex: 0.9,
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 15,
    },
    emptyContainer:{
        marginTop: 80,
        alignItems:'center'
    },
    emptyTitle:{
        fontSize:18,
        fontWeight:'600',
        marginBottom:8
    },
    emptySubtitle:{
        fontSize:14,
        color:'#666',
        textAlign:'center',
        paddingHorizontal:40
    }
});