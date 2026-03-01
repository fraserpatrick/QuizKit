import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Button, Keyboard, TextInput, TouchableWithoutFeedback, StyleSheet, Alert } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import {useAuth} from '@/context/AuthContext'
import PrimaryButtonWithIcon from '@/components/Buttons';
import { updateQuiz, createQuiz } from '@/api/quizzes';
import { useSounds } from '@/hooks/useSounds';
import { createLocalQuiz, updateLocalQuiz } from '@/localDatabase/quizzes';
import { quizMigration } from '@/utils/quizMigration';

export default function QuizInfoEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();
    const {username} = useAuth();
    const {playNotification} = useSounds();


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Quiz info editor',
            headerLeft: () => (
                <Button title="< Back" onPress={() => navigation.goBack()} />
            ),
            headerStyle: {
                backgroundColor: '#007BFF',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);


    const [title, setTitle] = useState(passedQuiz ? passedQuiz.title : '');
    const [description, setDescription] = useState(passedQuiz ? passedQuiz.description : '');
    const [visibility, setVisibility] = useState(passedQuiz ? passedQuiz.visibility : 'Private');
    const [saveType, setSaveType] = useState(passedQuiz ? passedQuiz.saveType : 'cloud');

    useEffect(() => {
        if (saveType === 'local') {
            setVisibility("Private");
        }
    }, [saveType]);

    const handleQuizSave = () => {
        if (!title?.trim()){
            alert('Please enter a quiz title.');
            return;
        }
        playNotification();
        if (passedQuiz){
            Alert.alert('Update quiz?', 'Are you sure you want to update this quiz?', [
                {text: 'No, go back', style: 'cancel',},
                {text: 'Yes, update quiz', onPress: handleUpdateQuiz , style: 'default',},
            ]);
        }
        else{
            Alert.alert('Create quiz?', 'Are you sure you want to create this quiz?', [
                {text: 'No, go back', style: 'cancel',},
                {text: 'Yes, create quiz', onPress: handleCreateQuiz , style: 'default',},
            ]);
        }
    }

    const handleCreateQuiz = async () => {
        try {
            let newQuiz;
            if (saveType === 'local') {
                newQuiz = await createLocalQuiz(title.trim(), username!, visibility, description.trim());
            }
            else if (saveType === 'cloud') {
                newQuiz = await createQuiz(title.trim(), username!, visibility, description.trim());
            }
            alert('Creating quiz with title: ' + title.trim());

            navigation.reset({index: 1, routes: [
                {name: 'Home' as never} as never,
                {name: 'QuizEditor' as never, params: { passedQuiz: newQuiz } as never,} as never,
            ],} as never);
        }
        catch (error) {
            console.error('Error creating quiz: ', error);
            alert('Failed to create quiz.');
        }
    }

    const handleUpdateQuiz = async () => {
        try {
            let updatedQuiz;
            if (passedQuiz.saveType === saveType){
                if (passedQuiz.saveType === 'local'){
                    updatedQuiz = await updateLocalQuiz(passedQuiz.id, title.trim(), visibility, description.trim());
                }
                else if (passedQuiz.saveType === 'cloud'){
                    updatedQuiz = await updateQuiz(passedQuiz.id, title.trim(), visibility, description.trim());
                }
            }
            else {
                updatedQuiz = await quizMigration(passedQuiz.id, username!, title.trim(), visibility, description.trim(), saveType);
            }
            
            console.log("Quiz updated");
            alert('Quiz saved successfully.');

            navigation.reset({index: 1, routes: [
                {name: 'Home' as never},
                {name: 'QuizInfoScreen' as never, params: { passedQuiz: updatedQuiz }} as never,
            ],} as never);
        } catch (error) {
            console.error('Error saving quiz: ', error);
            alert('Failed to save quiz.');
        }
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputHeader}>Title:</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        returnKeyType="next"
                    />
                    <Text style={styles.inputHeader}>Description:</Text>
                    <TextInput
                        style={styles.bigInput}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                    <Text style={styles.inputHeader}>Visibility:</Text>
                    <SegmentedButtons 
                        theme={{ colors: { secondaryContainer: '#FF6B00', onSecondaryContainer: '#FFFFFF' } }}
                        value={visibility}
                        onValueChange={setVisibility}
                        buttons={[
                            { value: 'Private', label: 'Private', showSelectedCheck:true, disabled:saveType === "local" },
                            { value: 'Public', label: 'Public', showSelectedCheck:true, disabled:saveType === "local" },        
                        ]}
                    />
                    <Text style={styles.inputHeader}>Save Location:</Text>
                    <SegmentedButtons 
                        theme={{ colors: { secondaryContainer: '#FF6B00', onSecondaryContainer: '#FFFFFF' } }}
                        value={saveType}
                        onValueChange={setSaveType}
                        buttons={[
                            { value: 'local', label: 'Local', showSelectedCheck:true },
                            { value: 'cloud', label: 'Cloud', showSelectedCheck:true },        
                        ]}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <PrimaryButtonWithIcon label={passedQuiz ? 'Save quiz changes' : 'Create new quiz'} icon={passedQuiz ? 'save' : 'plus'} onPress={handleQuizSave}/>
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
    inputContainer:{
        flex: 0.8,
    },
    buttonsContainer:{
        flex: 0.1,
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