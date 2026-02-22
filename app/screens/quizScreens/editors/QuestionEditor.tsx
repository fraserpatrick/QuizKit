import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Button, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from 'react-native-dropdown-select-list';
import { SegmentedButtons } from "react-native-paper";
import { PrimaryButtonWithIcon } from "@/app/components/Button";
import { createQuestion, deleteQuestion, updateQuestion } from "@/api/questions";
import { createLocalQuestion, updateLocalQuestion, deleteLocalQuestion } from "@/localDatabase/questions";
import { useSounds } from "@/app/hooks/useSounds";

export default function QuestionEditor({route}: any) {
    const {passedQuestion, passedQuiz} = route.params;
    const navigation = useNavigation();
    const {playNotification} = useSounds();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Question Editor',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            )
        });
    }, []);


    const types = [
        'Single Answer',
        'Multiple Choice',
        'True or False',
    ];

    const defaultTypeOption = passedQuestion
    ? { key: passedQuestion.type, value: passedQuestion.type }
    : undefined;

    const [text, setText] = useState(passedQuestion ? passedQuestion.text : '');
    const [type, setType] = useState(passedQuestion ? passedQuestion.type : '');
    const [answer, setAnswer] = useState(passedQuestion ? passedQuestion.correctAnswer : '');
    const [feedback, setFeedback] = useState(passedQuestion ? passedQuestion.feedback : '');

    let options: string[] = [''];
    if (passedQuestion?.type === 'Multiple Choice' && passedQuestion?.options) {
        try {
            const parsed: unknown = JSON.parse(passedQuestion.options);
            if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                options = parsed;
            } 
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    }

    const [wrongAnswer1, setWrongAnswer1] = useState(options[1] || '');
    const [wrongAnswer2, setWrongAnswer2] = useState(options[2] || '');
    const [wrongAnswer3, setWrongAnswer3] = useState(options[3] || '');



    const saveQuestion = async () => {
        if (text.trim() === '' || type.trim() === '' || answer.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        let options = [''];

        if (type === 'Multiple Choice') {
            options = [answer.trim(), wrongAnswer1.trim(), wrongAnswer2.trim(), wrongAnswer3.trim()].filter(opt => opt !== '');
            if (options.length < 2) {
                alert('Please provide at least 1 incorrect answer.');
                return;
            }
        }

        try {
            if (!passedQuestion) {
                if (passedQuiz.saveType === 'local'){
                    await createLocalQuestion(passedQuiz.id, text.trim(), type, answer.trim(), options, feedback?.trim());
                }
                else if (passedQuiz.saveType === 'cloud'){
                    await createQuestion(passedQuiz.id, text.trim(), type, answer.trim(), options, feedback?.trim());
                }
                alert('Question saved successfully.');
            } else {
                if (passedQuiz.saveType === 'local'){
                    await updateLocalQuestion(passedQuestion.id, text.trim(), type, answer.trim(), options, feedback?.trim());
                } else if (passedQuiz.saveType === 'cloud'){
                    await updateQuestion(passedQuestion.id, text.trim(), type, answer.trim(), options, feedback?.trim());
                }
                alert('Question updated successfully.');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving question: ', error);
            alert('Failed to save question.');
        }
    };

    const deleteQuestionAlert = () => { 
        playNotification();
        Alert.alert(
            'Delete Question', 'Are you sure you want to delete this question?', [
                {text: 'No, keep it', style: 'cancel',},
                {text: 'Yes, delete it', onPress: () => handleDeleteQuestion(), style: 'destructive',},
            ]
        );
}

    const handleDeleteQuestion = () => {
        console.log('Deleting question with id: ' + passedQuestion.id);
        try {
            if (passedQuiz.saveType === 'local'){
                deleteLocalQuestion(passedQuestion.id);
            } else if (passedQuiz.saveType === 'cloud'){
                deleteQuestion(passedQuestion.id);
            }
            alert('Question deleted successfully.');
            navigation.goBack();
        }
        catch (error) {
            console.error('Error deleting question: ', error);
            alert('Failed to delete question.');
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ScrollView style={passedQuestion ? {flex: 0.7} : {flex: 0.8}}>
                    <Text style={styles.inputHeader}>Question Text:</Text>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                    />
                    <Text style={styles.inputHeader}>Type:</Text>
                    <SelectList
                        setSelected={setType}
                        data={types}
                        placeholder="Select a question type"
                        search={false}
                        defaultOption={defaultTypeOption}
                    />

                    {type && (
                        <Text style={styles.inputHeader}>Answer:</Text>
                    )}
                    {type === 'Single Answer' &&(<>
                        <TextInput
                            style={styles.input}
                            value={answer}
                            onChangeText={setAnswer}
                        />
                    </>)}
                    {type === 'Multiple Choice' &&(<>
                        <TextInput
                            style={styles.input}
                            value={answer}
                            onChangeText={setAnswer}
                        />
                        <Text style={styles.inputHeader}>Incorrect answers:</Text>
                        <TextInput
                            style={styles.input}
                            value={wrongAnswer1}
                            onChangeText={setWrongAnswer1}
                        />
                        <TextInput
                            style={styles.input}
                            value={wrongAnswer2}
                            onChangeText={setWrongAnswer2}
                        />
                        <TextInput
                            style={styles.input}
                            value={wrongAnswer3}
                            onChangeText={setWrongAnswer3}
                        />
                    </>)}
                    {type === 'True or False' &&(<>
                        <SegmentedButtons
                            theme={{ colors: { secondaryContainer: '#FF6B00', onSecondaryContainer: '#FFFFFF' } }}
                            value={answer}
                            onValueChange={setAnswer}
                            buttons={[
                                { value: 'True', label: 'True', showSelectedCheck:true}, { value: 'False', label: 'False', showSelectedCheck:true},        
                            ]}
                        />
                    </>)}

                    <Text style={styles.inputHeader}>Feedback:</Text>
                    <TextInput
                        style={styles.bigInput}
                        value={feedback}
                        onChangeText={setFeedback}
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>

                <View style={passedQuestion ? {flex: 0.25} : {flex: 0.15}}>
                    <PrimaryButtonWithIcon label={passedQuestion ? 'Update Question' : 'Create Question'} icon="save" onPress={saveQuestion}/>
                    {passedQuestion && (
                        <PrimaryButtonWithIcon label="Delete Question" icon="delete" onPress={deleteQuestionAlert}/>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    inputHeader:{
        fontSize: 20,
        marginBottom: 5,
        marginTop: 10,
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
});