import { useNavigation } from "expo-router";
import { useState } from "react";
import { Image, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity } from "react-native";
import styles from './../../../assets/images/Styles';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();

    const [resetPasswordUsername, setResetPasswordUsername] = useState('');

    const handleForgot = () => {
        if (!resetPasswordUsername.trim()) {
            alert('Please enter your username');
            return;
        }

        console.log('Password reset requested for:', resetPasswordUsername);
    }

    const handleNavigateToLogin = () => {
        navigation.navigate('Login' as never);
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
                            <Image source={require('./../../../assets/images/icon.png')} style={styles.loginScreen_image} />
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
                            <TouchableOpacity onPress={handleNavigateToLogin} >
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