import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styles from './../../assets/images/Styles';
import database from './../../DatabaseController';
import { SegmentedButtons } from 'react-native-paper';

export default function QuizCreationScreen() {
    const navigation = useNavigation();
    const loggedInUsername = 0;

    const [quizName, setQuizName] = useState('');
    const [visibility, setVisibility] = useState('Private');

    const handleCreateQuiz = async  () => {
        if (quizName.trim() === '') {
            alert('Please enter a valid quiz name.');
            return;
        }

        try {
            const newQuiz = await database.createQuiz(quizName.trim(), loggedInUsername, visibility);
            alert('Creating quiz with name: ' + quizName.trim());
            console.log('Creating quiz with name: ' + quizName.trim());
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            style={styles.loginScreen_container}
        >
            <ScrollView contentContainerStyle={styles.loginScreen_scrollContainer} keyboardShouldPersistTaps="handled">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreen_innerContainer}>
                        <View style={styles.loginScreen_imageContainer}>
                            <Image source={require('./../../assets/images/icon.png')} style={styles.loginScreen_image} />
                        </View>
                        <View style={styles.loginScreen_inputContainer}>
                            <Text style={styles.loginScreen_inputHeader}>Quiz title:</Text>
                            <TextInput
                                style={styles.loginScreen_input}
                                value={quizName}
                                onChangeText={setQuizName}
                                returnKeyType="done"
                            />
                            <Text style={styles.loginScreen_inputHeader}>Visibility:</Text>
                            <SegmentedButtons
                                value={visibility}
                                onValueChange={setVisibility}
                                buttons={[
                                    { value: 'Private', label: 'Private'}, { value: 'Public', label: 'Public'},        
                                ]}
                            />
                            <TouchableOpacity onPress={handleCreateQuiz} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Create new quiz</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}