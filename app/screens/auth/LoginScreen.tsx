import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import styles from './../../../assets/images/Styles';
import { useAuth } from "@/app/AuthContext";


export default function LoginScreen() {
    const navigation = useNavigation();
    const {signIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        console.log('Attempting login with:', email);

        try {
            const user = await signIn(email,password);
            console.log('User signed in!', user.email);
        } 
        catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
            setPassword('');
            return;
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword' as never);
    }

    const handleCreateAccount = () => {
        navigation.navigate('SignUp' as never);
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
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={handleLogin} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Login</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleForgotPassword} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Forgot Password?</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreateAccount} >
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
}