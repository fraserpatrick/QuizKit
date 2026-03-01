import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Button, ScrollView, Image, Pressable, Modal } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from 'react-native-dropdown-select-list';
import { SegmentedButtons } from "react-native-paper";
import { PrimaryButtonWithIcon } from "@/app/components/Buttons";
import { createQuestion, deleteQuestion, updateQuestion, uploadImage } from "@/api/questions";
import { createLocalQuestion, updateLocalQuestion, deleteLocalQuestion } from "@/localDatabase/questions";
import { useSounds } from "@/app/hooks/useSounds";
import Slider from '@react-native-community/slider';
import Checkbox from "expo-checkbox";
import { Question } from "@/app/components/Interfaces";
import * as ImagePicker from 'expo-image-picker';

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
        'True or False',
        'Multiple Choice',
        'Multiple Select',
        'Slider',
    ];

    const defaultTypeOption = passedQuestion
        ? { key: passedQuestion.type, value: passedQuestion.type }
        : undefined;

    const [previewVisible, setPreviewVisible] = useState(false);
    const [text, setText] = useState(passedQuestion ? passedQuestion.text : '');
    const [type, setType] = useState(passedQuestion ? passedQuestion.type : '');
    const [answer, setAnswer] = useState(passedQuestion ? passedQuestion.correctAnswer : '');
    const [feedback, setFeedback] = useState(passedQuestion ? passedQuestion.feedback : '');


    function parseOptions(question: Question, type: string) {
        let mcOptions: string[] = []
        let correctAnswers: string[] = []

        if (question.mcOptions) {
            try {
                mcOptions = Array.isArray(question.mcOptions) ? question.mcOptions : JSON.parse(question.mcOptions)
            } catch {
                mcOptions = []
            }
        }

        if (question.correctAnswer) {
            try {
                correctAnswers = type === "Multiple Select" ? JSON.parse(question.correctAnswer) : [question.correctAnswer]
            } catch {
                correctAnswers = []
            }
        }

        return mcOptions.map(option => ({
            text: option,
            correct: correctAnswers.includes(option)
        }))
    }


    const [options, setOptions] = useState(() =>{
        if (!passedQuestion || !passedQuestion.mcOptions) {
            return [{text: "", correct: false}];
        }
        return parseOptions(passedQuestion,passedQuestion.type)
    });


    const addOption = () => {
        setOptions(prev => [
            ...prev,
            {text: "", correct: false}
        ])
    }

    const removeOption = (index: number) => {
        setOptions(prev => prev.filter(
            (_,i)=>i!==index
        ))
    }

    const updateOptionText = (index: number, value: string) => {
        setOptions(prev => {
            const copy=[...prev];
            copy[index].text=value;
            return copy;
        })
    }

    const toggleCorrect = (index: number) => {
        setOptions(prev=>{
            let copy=[...prev]

            if (type === "Multiple Choice") {
                copy = copy.map(
                    (option,i) => ({
                        ...option,
                        correct:i === index
                    })
                )
            } else {
                copy[index].correct =! copy[index].correct
            }
            return copy
        })
    }


    const [sliderStart, setSliderStart] = useState(0);
    const [sliderEnd, setSliderEnd] = useState(100);


    const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
    const [imageUri, setImageUri] = useState(() => {
        if (!passedQuestion) {
            return "";
        }

        if (passedQuestion.imageUri === ""){
            return "";
        }

        return passedQuiz?.saveType === 'cloud' 
            ? baseURL + 'uploads/' + passedQuestion.imageUri
            : passedQuestion?.imageUri;
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    }


    const saveQuestion = async () => {
        if (text.trim() === '') {
            alert('Please enter a question.');
            return;
        }

        let mcOptions : string[] = [];
        let correctAnswers : string[] = [];
        let finalAnswer = "";
        let finalImageUri = imageUri;

        if (type === "Multiple Choice" || type === "Multiple Select") {
            mcOptions = options.map(option => option.text.trim()).filter(Boolean)
            correctAnswers = options.filter(option => option.correct).map(option=>option.text)

            if(mcOptions.length<2){
                alert("Add options")
                return
            }

            if (correctAnswers.length === 0) {
                alert("Pick a correct answer")
                return
            }
        }


        if (type === "Multiple Choice") {
            finalAnswer = correctAnswers[0]
        } else if (type === "Multiple Select") {
            finalAnswer = JSON.stringify(correctAnswers)
        } else {
            finalAnswer = answer
        }


        if (passedQuiz.saveType === "cloud" && imageUri.startsWith("file://")) {
            finalImageUri = await uploadImage(imageUri);
        }
        console.log(finalImageUri)

        if (finalImageUri.includes('uploads/')) {
            finalImageUri = finalImageUri.split('uploads/')[1];
        }


        try {
            if (!passedQuestion) {
                if (passedQuiz.saveType === 'local'){
                    await createLocalQuestion(passedQuiz.id, text.trim(), type, finalAnswer, mcOptions, feedback?.trim(), imageUri);
                }
                else if (passedQuiz.saveType === 'cloud'){
                    await createQuestion(passedQuiz.id, text.trim(), type, finalAnswer, mcOptions, feedback?.trim(), finalImageUri);
                }
                alert('Question saved successfully.');
            } else {
                if (passedQuiz.saveType === 'local'){
                    await updateLocalQuestion(passedQuestion.id, text.trim(), type, finalAnswer, mcOptions, feedback?.trim(), imageUri);
                } else if (passedQuiz.saveType === 'cloud'){
                    await updateQuestion(passedQuestion.id, text.trim(), type, finalAnswer, mcOptions, feedback?.trim(), finalImageUri);
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
    };

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


    const renderOptions = () => {
        if (type !== "Multiple Choice" && type !== "Multiple Select") {
            return null;
        }

        return (<>
            <Text style={styles.inputHeader}>Options</Text>
            {options.map((option,index) => (
                <View key={index} style={styles.row}>
                    <TextInput
                        style={styles.optionInput}
                        value={option.text}
                        onChangeText={value => updateOptionText(index,value)}
                    />
                    <Checkbox
                        value={option.correct}
                        onValueChange={()=>toggleCorrect(index)}
                    />
                    <Button title="X" onPress={() => removeOption(index)}/>
                </View>
            ))}
            <Button title="Add Option" onPress={addOption}/>
        </>)
    }


    const renderInput = (type: string) => {
        switch (type) {
            case 'Single Answer':
                return (
                    <TextInput
                        style={styles.input}
                        value={answer}
                        onChangeText={setAnswer}
                    />
                )

            case 'True or False':
                return (
                    <SegmentedButtons
                        theme={{ colors: { secondaryContainer: '#FF6B00', onSecondaryContainer: '#FFFFFF' } }}
                        value={answer}
                        onValueChange={setAnswer}
                        buttons={[
                            { value: 'True', label: 'True', showSelectedCheck:true}, { value: 'False', label: 'False', showSelectedCheck:true},        
                        ]}
                    />
                )

            case 'Slider':
                return (<>
                    <Text style={styles.inputHeader}>Answer: {answer}</Text>
                    <TextInput
                        style={styles.input}
                        value={sliderStart.toString()}
                        onChangeText={(text) => setSliderStart(parseInt(text) || 0)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={sliderEnd.toString()}
                        onChangeText={(text) => setSliderEnd(parseInt(text) || 0)}
                        keyboardType="numeric"
                    />
                    <Slider
                        step={1}
                        maximumValue={sliderEnd}
                        minimumValue={sliderStart}
                        onValueChange={(value) => setAnswer(value.toString())}
                        tapToSeek={true}
                    />
                </>)

            case 'Multiple Select':
                return renderOptions();

            case 'Multiple Choice':
                return renderOptions();

            default:
                return null;
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ScrollView  contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}>
                    <Text style={styles.inputHeader}>Question Text:</Text>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                    />

                    <Text style={styles.inputHeader}>Image (Optional)</Text>
                    {imageUri === "" ? (
                        <PrimaryButtonWithIcon
                            label="Add Image"
                            icon="camera"
                            onPress={pickImage}
                        />
                    ) : (<>
                        <Pressable onPress={() => setPreviewVisible(true)}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </Pressable>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button title="Change" onPress={pickImage} />
                            <Button
                                title="Remove"
                                color="#cc0000"
                                onPress={() => setImageUri("")}
                            />
                        </View>
                    </>)}

                    <Text style={styles.inputHeader}>Type:</Text>
                    <SelectList
                        setSelected={setType}
                        data={types}
                        placeholder="Select a question type"
                        search={false}
                        defaultOption={defaultTypeOption}
                    />

                    {type && (<>
                        <Text style={styles.inputHeader}>Answer:</Text>
                        {renderInput(type)}
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


                <Modal
                    visible={previewVisible}
                    transparent
                    animationType="fade"
                >
                    <Pressable
                        style={styles.modalContainer}
                        onPress={() => setPreviewVisible(false)}
                    >
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    </Pressable>
                </Modal>

                <View style={styles.floatingBar}>
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
    row:{
        flexDirection:"row",
        alignItems:"center",
        marginBottom:10
    },
    optionInput:{
        flex:1,
        borderWidth:1,
        padding:10,
        borderRadius:10,
        marginRight:10
    },
    floatingBar: {
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
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 15,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
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
    previewImage: {
        width: '100%',
        height: '100%',
    },
});