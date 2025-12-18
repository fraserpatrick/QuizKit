import { useState } from "react";
import { Image, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity } from "react-native";
import styles from './../../../assets/images/Styles';
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
    const navigation = useNavigation();

    const [newUsername, setNewUsername] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    const handleSignUp = () => {
            if (!newUsername.trim() || !newPassword1.trim() || !newPassword2.trim()) {
                alert('Please fill in all fields');
                return;
            }
    
            if (newPassword1 !== newPassword2) {
                alert('Passwords do not match');
                setNewPassword1('');
                setNewPassword2('');
                return;
            }
            console.log('Signing up with:', newUsername, newPassword1);
        };

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
                            <TouchableOpacity onPress={handleSignUp} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Create account</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNavigateToLogin} >
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
}