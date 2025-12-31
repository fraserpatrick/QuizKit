import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, Button } from "react-native";
import database from "@/DatabaseController";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from 'react-native-dropdown-select-list';
import { SegmentedButtons } from "react-native-paper";

export default function QuestionEditor({route}: any) {
    const {passedQuestion, passedQuiz} = route.params;
    const navigation = useNavigation();

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
    const [wrongAnswer1, setWrongAnswer1] = useState(passedQuestion ? passedQuestion.wrongAnswer1 : '');
    const [wrongAnswer2, setWrongAnswer2] = useState(passedQuestion ? passedQuestion.wrongAnswer2 : '');
    const [wrongAnswer3, setWrongAnswer3] = useState(passedQuestion ? passedQuestion.wrongAnswer3 : '');


    const saveQuestion = async () => {
        if (text.trim() === '' || type.trim() === '' || answer.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        if (type === 'Multiple Choice') {
            if (!wrongAnswer1?.trim() || !wrongAnswer2?.trim() || !wrongAnswer3?.trim()) {
                alert('Please provide all incorrect answers.');
                return;
            }
        }

        const wa1 = type === 'Multiple Choice' ? wrongAnswer1 : null;
        const wa2 = type === 'Multiple Choice' ? wrongAnswer2 : null;
        const wa3 = type === 'Multiple Choice' ? wrongAnswer3 : null;

        try {
            if (!passedQuestion) {
                await database.createQuestion(passedQuiz.id, type, text.trim(), answer.trim(), wa1, wa2, wa3);
                alert('Question saved successfully.');
            } else {
                await database.updateQuestion(passedQuestion.id, type, text.trim(), answer.trim(), wa1, wa2, wa3);
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
                            value={answer}
                            onValueChange={setAnswer}
                            buttons={[
                                { value: 'True', label: 'True'}, { value: 'False', label: 'False'},        
                            ]}
                        />
                    </>)}
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