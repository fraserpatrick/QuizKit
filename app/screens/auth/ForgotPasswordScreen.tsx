import { useNavigation } from "expo-router";
import { useState } from "react";
import { Image, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity } from "react-native";
import styles from './../../../assets/images/Styles';
import { useAuth } from "@/app/AuthContext";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const {resetPassword} = useAuth();

    const [email, setEmail] = useState('');

    const handleForgot = () => {
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }

        console.log('Password reset requested for:', email);

        try {
            const user = resetPassword(email);
            console.log('Password reset email sent to:', user);
            alert('Password reset email sent. Please check your inbox.');
            navigation.navigate('Login' as never);
        } 
        catch (error) {
            console.error('Password reset failed:', error);
            alert('Password reset failed. Please try again.');
            setEmail('');
        }
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
                            <Text style={styles.loginScreen_inputHeader}>Email:</Text>
                            <TextInput
                                style={styles.loginScreen_input}
                                value={email}
                                onChangeText={setEmail}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={handleForgot} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Send reset password email</Text>
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