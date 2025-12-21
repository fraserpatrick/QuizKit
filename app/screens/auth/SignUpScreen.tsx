import { useState } from "react";
import { Image, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity } from "react-native";
import styles from './../../../assets/images/Styles';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/AuthContext";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const {signUp} = useAuth();

    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSignUp = async () => {
            if (!email.trim() || !password1.trim() || !password2.trim()) {
                alert('Please fill in all fields');
                return;
            }

            if (password1 !== password2) {
                alert('Passwords do not match');
                setPassword1('');
                setPassword2('');
                return;
            }

            console.log('Signing up with:', email);

            try {
                const newUser = await signUp(email, password1);
                console.log('User account created & signed in!', newUser.email);
            }
            catch (error) {
                console.error('Sign up failed:', error);
                alert('Sign up failed. Please try again.');
                setEmail('');
                setPassword1('');
                setPassword2('');
            }
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
                            <Text style={styles.loginScreen_inputHeader}>Email:</Text>
                            <TextInput
                                style={styles.loginScreen_input}
                                value={email}
                                onChangeText={setEmail}
                                returnKeyType="next"
                            />
                            <Text style={styles.loginScreen_inputHeader}>Password:</Text>
                            <TextInput
                                style={styles.loginScreen_input}
                                value={password1}
                                onChangeText={setPassword1}
                                secureTextEntry
                                returnKeyType="next"
                            />
                            <Text style={styles.loginScreen_inputHeader}>Repeat password:</Text>
                            <TextInput
                                style={styles.loginScreen_input}
                                value={password2}
                                onChangeText={setPassword2}
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