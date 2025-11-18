import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import database from './../DatabaseController';
import styles from './../assets/images/Styles';


export default function LoginScreen() {
    const navigation = useNavigation();

    const [form, setForm] = useState(0);

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [newUsername, setNewUsername] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [newSecurityAnswer, setNewSecurityAnswer] = useState('');
    const [newSecurityQuestion, setNewSecurityQuestion] = useState('');
    const securityQuestions = [
        'What was your childhood nickname?',
        'What is the name of your favorite childhood friend?',
        'What was the name of your first pet?',
        'What was the make and model of your first car?',
        'In what city or town did your parents meet?',
        'What street did you grow up on?',
        'What was your favourite subject in school?',
        'What was your favorite hobby as a child?'
    ];
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [securityAnswerAttempt, setSecurityAnswerAttempt] = useState('');
    const [resetPasswordUsername, setResetPasswordUsername] = useState('');

    const handleLogin = async () => {
        if (!loginUsername || !loginPassword) {
            alert('Please enter both username and password');
            return;
        }

        try {
            const existingUser = await database.findUserByUsername(loginUsername.toLowerCase());

            if (!existingUser) {
                alert('User not found. Please sign up first.');
                setLoginPassword('');
                return;
            }

            if (existingUser.password !== loginPassword) {
                alert('Incorrect password. Please try again.');
                setLoginPassword('');
                return;
            }
            console.log('User logged in successfully:', existingUser.username);
            navigation.reset({index: 0, routes: [{ name: 'Home' as never }],} as never);
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred while logging in. Please try again.');
        }
    };

    const handleSignUp = async () => {
        if (!newUsername || !newPassword1 || !newPassword2) {
            alert('Please fill in all fields');
            return;
        }

        if (newPassword1 !== newPassword2) {
            alert('Passwords do not match');
            setNewPassword1('');
            setNewPassword2('');
            return;
        }

        if (!newSecurityQuestion) {
            alert('Please select a security question');
            return;
        }

        const existingUser = await database.findUserByUsername(newUsername.toLowerCase());
        if (existingUser) {
            alert('That username is already taken!');
            return;
        }

        try {
            await database.insertUser(newUsername.toLowerCase(), newPassword1, newSecurityQuestion, newSecurityAnswer.toLowerCase());
            console.log('User: ' + newUsername + ' created successfully');
            navigation.reset({index: 0, routes: [{ name: 'Home' as never }],} as never);
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Error creating user. Try again.');
        }
    };

    const handleForgot = async () => {
        try {
            const results = await database.findUserByUsername(resetPasswordUsername.toLowerCase());
            if (!results) {
                alert('User not found.');
                return;
            }
            setSecurityQuestion(results.securityQuestion);
            setSecurityAnswer(results.securityAnswer);
            switchForm(3);
        } catch (error) {
            console.error('Error retrieving security question:', error);
        }
    };

    const resetPassword = async () => {
        if (securityAnswer !== securityAnswerAttempt.toLowerCase()) {
            alert('Incorrect security answer');
            setSecurityAnswerAttempt('');
            return;
        }
        if (newPassword1 !== newPassword2) {
            alert('Passwords do not match');
            setNewPassword1('');
            setNewPassword2('');
            return;
        }
        try {
            await database.resetUserPassword(resetPasswordUsername.toLowerCase(), newPassword1);
            alert('Password has been reset successfully');
            switchForm(0);
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    const switchForm = async (form: number) => {
        setLoginUsername('');
        setLoginPassword('');

        setNewUsername('');
        setNewPassword1('');
        setNewPassword2('');

        setForm(form);
    };

    if (form === 0) {
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
                                <Image source={require('./../assets/images/icon.png')} style={styles.loginScreen_image} />
                            </View>
                            <View style={styles.loginScreen_inputContainer}>
                                <Text style={styles.loginScreen_inputHeader}>Username:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={loginUsername}
                                    onChangeText={setLoginUsername}
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>Password:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={loginPassword}
                                    onChangeText={setLoginPassword}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={handleLogin} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Login</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => switchForm(2)} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Forgot Password?</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => switchForm(1)} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Don't have an account?</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    } else if (form === 1) {
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
                                <Image source={require('./../assets/images/icon.png')} style={styles.loginScreen_image} />
                            </View>
                            <View style={styles.loginScreen_inputContainer}>
                                <Text style={styles.loginScreen_inputHeader}>Username:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>Password:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newPassword1}
                                    onChangeText={setNewPassword1}
                                    secureTextEntry
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>Repeat password:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newPassword2}
                                    onChangeText={setNewPassword2}
                                    secureTextEntry
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>Security question:</Text>
                                <SelectList
                                    setSelected={setNewSecurityQuestion}
                                    data={securityQuestions}
                                    placeholder="Select a security question"
                                    search={false}
                                />
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newSecurityAnswer}
                                    onChangeText={setNewSecurityAnswer}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={handleSignUp} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Create account</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => switchForm(0)} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>I already have an account</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    } else if (form === 2) {
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
                                <Image source={require('./../assets/images/icon.png')} style={styles.loginScreen_image} />
                            </View>
                            <View style={styles.loginScreen_inputContainer}>
                                <Text style={styles.loginScreen_inputHeader}>Username:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={resetPasswordUsername}
                                    onChangeText={setResetPasswordUsername}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={handleForgot} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Forgot password</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => switchForm(0)} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Back to login</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
    else if (form === 3) {
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
                                <Image source={require('./../assets/images/icon.png')} style={styles.loginScreen_image} />
                            </View>
                            <View style={styles.loginScreen_inputContainer}>
                                <Text style={styles.loginScreen_inputHeader}>{securityQuestion}</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={securityAnswerAttempt}
                                    onChangeText={setSecurityAnswerAttempt}
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>New password:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newPassword1}
                                    onChangeText={setNewPassword1}
                                    secureTextEntry
                                    returnKeyType="next"
                                />
                                <Text style={styles.loginScreen_inputHeader}>Repeat password:</Text>
                                <TextInput
                                    style={styles.loginScreen_input}
                                    value={newPassword2}
                                    onChangeText={setNewPassword2}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={resetPassword} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Change password</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => switchForm(0)} >
                                    <View style={styles.loginScreen_button}>
                                        <Text style={styles.loginScreen_buttonText}>Back to login</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}