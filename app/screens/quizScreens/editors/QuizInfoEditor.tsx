import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from "react";
import { View, Text, Button, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Alert } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import {useAuth} from '@/app/AuthContext'
import { updateQuiz, createQuiz } from '@/api/quizzes';

export default function QuizInfoEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();
    const {username} = useAuth();


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Quiz info editor',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            )
        });
    }, []);


    const [title, setTitle] = useState(passedQuiz ? passedQuiz.title : '');
    const [description, setDescription] = useState(passedQuiz ? passedQuiz.description : '');
    const [visibility, setVisibility] = useState(passedQuiz ? passedQuiz.visibility : 'Private');

    const handleQuizSave = () => {
        if (!title?.trim()){
            alert('Please enter a quiz title.');
            return;
        }

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
            const newQuiz = await createQuiz(title.trim(), username!, visibility, description.trim());
            alert('Creating quiz with title: ' + title.trim());
            console.log('Creating quiz with title: ' + title.trim());

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
            const updatedQuiz = await updateQuiz(passedQuiz.id, title.trim(), visibility, description.trim());
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
                        value={visibility}
                        onValueChange={setVisibility}
                        buttons={[
                            { value: 'Private', label: 'Private'}, { value: 'Public', label: 'Public'},        
                        ]}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleQuizSave} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {passedQuiz ? 'Save quiz changes' : 'Create new quiz'}
                            </Text>
                        </View>
                    </TouchableOpacity>
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