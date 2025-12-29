import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from "react-native";
import database from "@/DatabaseController";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from 'react-native-dropdown-select-list';

export default function QuestionEditor({route}: any) {
    const {passedQuestion, passedQuiz} = route.params;
    const navigation = useNavigation();

    const types = [
        'Single Answer',
        'Multiple Choice',
        'True/False',
    ];

    const defaultTypeOption = passedQuestion
    ? { key: passedQuestion.type, value: passedQuestion.type }
    : undefined;

    const [text, setText] = useState(passedQuestion ? passedQuestion.text : '');
    const [type, setType] = useState(passedQuestion ? passedQuestion.type : '');
    const [answer, setAnswer] = useState(passedQuestion ? passedQuestion.correctAnswer : '');


    const saveQuestion = async () => {
        if (text.trim() === '' || type.trim() === '' || answer.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        try {
            if (!passedQuestion) {
                await database.createQuestion(passedQuiz.id, type, text, answer);
                alert('Question saved successfully.');
            } else {
                await database.updateQuestion(passedQuestion.id, type, text, answer);
                alert('Question updated successfully.');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving question: ', error);
            alert('Failed to save question.');
        }
    };

    const handleDeleteQuestion = () => Alert.alert(
        'Delete Question', 'Are you sure you want to delete this question?', [
            {text: 'No, keep it', style: 'cancel',},
            {text: 'Yes, delete it', onPress: () => deleteQuestion(), style: 'destructive',},
    ]);

    const deleteQuestion = async () => {
        try {
            await database.deleteQuestion(passedQuestion.id);
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
                <View style={passedQuestion ? {flex: 0.8} : {flex: 0.9}}>
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

                    
                    <Text style={styles.inputHeader}>Answer:</Text>
                    <TextInput
                        style={styles.input}
                        value={answer}
                        onChangeText={setAnswer}
                    />
                </View>

                <View style={passedQuestion ? {flex: 0.2} : {flex: 0.1}}>
                    <TouchableOpacity onPress={saveQuestion} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {passedQuestion ? 'Update Question' : 'Create Question'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {passedQuestion && (
                        <TouchableOpacity onPress={handleDeleteQuestion} >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Delete Question</Text>
                            </View>
                        </TouchableOpacity>
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
    inputHeader:{
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
});