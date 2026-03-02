import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { PrimaryButtonWithIcon } from '@/components/Buttons';
import { updateUsername, getUserByUsername } from '@/api/users';
import { updateQuizToNewUsername } from '@/api/quizzes';
import { useSounds } from '@/hooks/useSounds';
import { updateLocalQuizToNewUsername } from '@/localDatabase/quizzes';
import { resetDatabase } from '@/localDatabase/databaseConnection';

export default function ProfileEditor() {
    const { username, user, changeUsername } = useAuth();
    const navigation = useNavigation();
    const {playNotification} = useSounds();
    const [loadingUsername, setLoadingUsername] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState(username!);


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Edit Profile',
            headerLeft: () => (
                <Button title="< Profile" onPress={navigation.goBack} />
            ),
        });
    }, []);


    const handleUpdateUsername = async () => {
        try {
            let newUsername = usernameInput.trim().toLowerCase();
            await updateUsername(user!.email!, newUsername);

            updateQuizToNewUsername(username!, newUsername);
            updateLocalQuizToNewUsername(username!, newUsername);

            changeUsername(newUsername);

            alert('Username updated successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating username:', error);
            alert('Failed to update username.');
        } finally {
            setLoadingUsername(false);
        }
    }


    const updateUsernameAlert = () => {
        playNotification();
        Alert.alert(
            'Update Username', `Are you sure you want to change your username to ${usernameInput.trim().toLowerCase()}?`, [
                {text: 'No, don\'t  change', style: 'cancel',},
                {text: 'Yes, change it', onPress: () => handleUpdateUsername(), style: 'default',},
        ]);
    };


    const checkUpdateUsername = async () => {
        if (loadingUsername) {
            return;
        }

        const newUsername = usernameInput.trim().toLowerCase();

        if (newUsername === '') {
            alert('Username cannot be empty.');
            setUsernameInput(username!);
            return;
        }

        if (newUsername !== username) {
            const userCheck = await getUserByUsername(newUsername);
            if (userCheck !== null) {
                alert('Username is already taken.');
                return;
            }
            setLoadingUsername(true);
            updateUsernameAlert();
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.inputHeader}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={usernameInput}
                        onChangeText={setUsernameInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="username"
                        returnKeyType="done"
                        onSubmitEditing={checkUpdateUsername}
                    />
                    <PrimaryButtonWithIcon label={loadingUsername ? 'Updating username...' : 'Update username'} icon="save" onPress={checkUpdateUsername}/>
                </View>
            <Button title="Reset Database" onPress={resetDatabase} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        padding: 20,
    },
    inputHeader:{
        fontSize: 18,
        marginBottom: 3
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