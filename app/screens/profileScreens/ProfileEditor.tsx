import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/app/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateUsername, getUserByUsername } from '@/api/users';

export default function ProfileEditor() {
    const { username, user, changeUsername, changePassword } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Edit Profile',
            headerLeft: () => (
                <Button title="< Profile" onPress={navigation.goBack} />
            ),
        });
    }, []);


    const [usernameInput, setUsernameInput] = useState(username!);
    const [passwordInput1, setPasswordInput1] = useState('');
    const [passwordInput2, setPasswordInput2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleProfileSave = async () => {
        if (usernameInput.trim() === '') {
            alert('Username cannot be empty.');
            setUsernameInput(username!);
            return;
        }

        if (passwordInput1.trim() !== passwordInput2.trim()) {
            alert('Passwords do not match.');
            setPasswordInput1('');
            setPasswordInput2('');
            return;
        }
        if (passwordInput1.trim().length < 6 && passwordInput1.trim() !== '') {
            alert('Password must be at least 6 characters long.');
            setPasswordInput1('');
            setPasswordInput2('');
            return;
        }
        if (passwordInput1.trim().toLowerCase() === passwordInput1.trim() && passwordInput1.trim() !== '') {
            alert('Password must contain at least one uppercase letter.');
            setPasswordInput1('');
            setPasswordInput2('');
            return;
        }

        if (usernameInput.trim().toLowerCase() !== username) {
            const existingUsers = await getUserByUsername(usernameInput.trim().toLowerCase());
            if (existingUsers.length > 0) {
                alert('Username is already taken.');
                return;
            }

            try {
                await updateUsername(user!.email!, usernameInput.trim().toLowerCase());
                //await database.updateQuizToNewUsername(username!, usernameInput.trim().toLowerCase());
                changeUsername(usernameInput.trim().toLowerCase());
                alert('Username updated successfully.');
                navigation.goBack();
            } catch (error) {
                console.error('Error updating username:', error);
                alert('Failed to update username.');
            }
        }

        if (passwordInput1.trim() !== '') {
            try {
                changePassword!(passwordInput1);
                alert('Password updated successfully.');
                navigation.goBack();
            } catch (error) {
                console.error('Error updating password:', error);
                alert('Failed to update password.');
            }
        }

        navigation.goBack();
    };

    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.inputHeader}>Username:</Text>
                <TextInput
                    style={styles.input}
                    value={usernameInput}
                    onChangeText={setUsernameInput}
                    returnKeyType="done"
                />
                <Text style={styles.inputHeader}>New Password:</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={passwordInput1}
                        onChangeText={setPasswordInput1}
                        secureTextEntry={!showPassword1}
                        returnKeyType="next"
                    />
                    <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword1}>
                        <MaterialCommunityIcons
                            name={showPassword1 ? 'eye-off' : 'eye'}
                            size={24}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.inputHeader}>Repeat New Password:</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={passwordInput2}
                        onChangeText={setPasswordInput2}
                        secureTextEntry={!showPassword2}
                        returnKeyType="done"
                    />
                    <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword2}>
                        <MaterialCommunityIcons
                            name={showPassword2 ? 'eye-off' : 'eye'}
                            size={24}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleProfileSave}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Save Profile Changes</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        padding: 10,
    },
    inputHeader:{
        fontSize: 18,
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
    passwordInput:{
        flex: 1,
        paddingVertical: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        backgroundColor: '#ffffffff',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    iconButton: {
        marginLeft: -50, 
    },
});