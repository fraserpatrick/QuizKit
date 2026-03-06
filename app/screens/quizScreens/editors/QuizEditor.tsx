import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Question } from '@/components/Interfaces';
import { useState, useCallback, useLayoutEffect } from 'react';
import { PrimaryButtonWithIcon } from '@/components/Buttons';
import { getQuizQuestions } from '@/api/questions';
import { getLocalQuizQuestions, updateLocalQuestionOrder } from '@/localDatabase/questions';
import { QuestionItem } from '@/components/Items';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();
    const [reorderMode, setReorderMode] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [tempQuestions, setTempQuestions] = useState<Question[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Editing: ${passedQuiz.title}`,
            headerLeft: () => (
                <Button title="< Back" onPress={() => navigation.goBack()} />
            ),
            headerRight: () => (
                <Button
                    title={reorderMode ? "Exit" : "Reorder"}
                    onPress={toggleReorderMode}
                />
            ),
        });
    }, [navigation, passedQuiz.title, reorderMode]);


    const loadQuestions = async () => {
            try {
                if (passedQuiz.saveType === 'local'){
                    const localQuestions = await getLocalQuizQuestions(passedQuiz.id!);
                    setQuestions(localQuestions)
                    setTempQuestions(localQuestions);
                } else if (passedQuiz.saveType === 'cloud'){
                    const cloudQuestions = await getQuizQuestions(passedQuiz.id!)
                    setQuestions(cloudQuestions);
                    setTempQuestions(cloudQuestions);
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


    const toggleReorderMode = () => {
        if (reorderMode) {
            setTempQuestions(questions);
        }
        setReorderMode(!reorderMode);
    }


    const handleCreateQuestions = () => {
        navigation.navigate('QuestionEditor', { passedQuestion: null, passedQuiz });
    };

    const handleOpenQuestion = (question: Question) => {
        navigation.navigate('QuestionEditor', { passedQuestion: question, passedQuiz });
    }


    const saveQuestionOrder = async (newQuestions: Question[]) => {
        console.log("SAVING")
        setQuestions(newQuestions);
        if (passedQuiz.saveType === 'local'){
            await updateLocalQuestionOrder(newQuestions);
        } else if (passedQuiz.saveType === 'cloud'){
            
        }
    }


    const handleButtonPress = () => {
        if (reorderMode) {
            saveQuestionOrder(tempQuestions);
            setReorderMode(false);
        }
        else {
            handleCreateQuestions();
        }
    }


    const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<Question>) => {
        const listForNumbering = reorderMode ? tempQuestions : questions;
        const questionNumber = listForNumbering.indexOf(item) + 1;
    
        return (
            <QuestionItem
            question={item}
            onPress={!reorderMode ? () => handleOpenQuestion(item) : undefined}
            onLongPress={reorderMode ? drag : undefined}
            isActive={isActive}
            number={questionNumber}
            />
        )   
    }; 


    return (
        <View style={styles.container}>
                <DraggableFlatList
                    data={reorderMode ? tempQuestions : questions}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{paddingBottom: 60}}
                    onDragEnd={({data}) => reorderMode && setTempQuestions(data)}
                    renderItem={renderDraggableItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No questions yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Tap "Create new question" to start building your quiz.
                            </Text>
                        </View>
                    )}
                />
            <View style={styles.buttonsContainer}>
                <PrimaryButtonWithIcon label={reorderMode ? 'Update question order' : 'Create new question'} icon={reorderMode ? 'save' : 'plus'} onPress={handleButtonPress}/>
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