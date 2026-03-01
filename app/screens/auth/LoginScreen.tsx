import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from "@/components/Buttons";

export default function LoginScreen() {
    const navigation = useNavigation();
    const {signIn} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef<TextInput>(null);


    const handleLogin = async () => {
        if (loading) {
            return;
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            alert('Please enter both email and password');
            return;
        }

        console.log('Attempting login with:', email);

        try {
            setLoading(true);

            const user = await signIn(cleanEmail, password);
            console.log('User signed in!', user.email);
        } 
        catch (error: any) {
            console.log(error)

            if (error.code === 'auth/invalid-credential') {
                alert('Incorrect login details.');
            } else {
                alert('Something went wrong. Please try again.');
            }
            setPassword('');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword' as never);
    }

    const handleCreateAccount = () => {
        navigation.navigate('SignUp' as never);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isPasswordValid = (pw: string) => ({
        minLength: pw.length >= 8,
        hasUppercase: /[A-Z]/.test(pw),
        hasNumber: /\d/.test(pw),
    });


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={require('@/assets/images/icon.png')} style={styles.image} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeader}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        <Text style={styles.inputHeader}>Password:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                ref={passwordRef}
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword}>
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordRules}>
                            {Object.entries(isPasswordValid(password)).map(([key, valid]) => (
                                <Text key={key} style={{ color: valid ? 'green' : 'red', fontSize: 12 }}>
                                    {key === 'minLength' ? 'At least 8 characters' :
                                    key === 'hasUppercase' ? 'Contains uppercase letter' :
                                    key === 'hasNumber' ? 'Contains a number' : ''}
                                </Text>
                            ))}
                        </View>
                        <PrimaryButton label={loading ? "Logging in..." : "Login"} onPress={handleLogin}/>
                        <PrimaryButton label="Forgot Password?" onPress={handleForgotPassword}/>
                        <PrimaryButton label="Don't have an account?" onPress={handleCreateAccount} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer:{
        alignItems: 'center',
        marginBottom: 40,
    },
    image:{
        width: width* 0.8,
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 30
    },
    inputContainer:{
        width: '80%',
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
        marginBottom: 5,
    },
    iconButton: {
        padding: 5, 
    },
    inputHeader:{
        fontSize: 18,
    },
    passwordRules: {
        marginBottom: 8,
    },
});