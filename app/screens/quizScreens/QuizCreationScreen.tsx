import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import database from '@/DatabaseController';
import { SegmentedButtons } from 'react-native-paper';

export default function QuizCreationScreen() {
    const navigation = useNavigation();
    const loggedInUsername = 0;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('Private');

    const handleCreateQuiz = () => {
        if (name.trim() === '') {
            alert('Please enter a valid quiz title.');
            return;
        }

        Alert.alert('Create quiz?', 'Are you sure you want to create this quiz?', [
            {text: 'No, go back', style: 'cancel',},
            {text: 'Yes, create quiz', onPress: createQuiz , style: 'default',},
        ]);
    }

    const createQuiz = async () => {
        try {
            const newQuiz = await database.createQuiz(name.trim(), loggedInUsername, visibility, description.trim());
            alert('Creating quiz with name: ' + name.trim());
            console.log('Creating quiz with name: ' + name.trim());

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputHeader}>Title:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        returnKeyType="next"
                    />
                    <Text style={styles.inputHeader}>Description:</Text>
                    <TextInput
                        style={styles.bigInput}
                        value={description}
                        onChangeText={setDescription}
                        returnKeyType="done"
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
                    <TouchableOpacity onPress={handleCreateQuiz} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Create new quiz</Text>
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