import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Dimensions } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from "@/components/Buttons";

export default function LoginScreen() {
    const navigation = useNavigation();
    const {signIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


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

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    return (
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
                        returnKeyType="next"
                    />
                    <Text style={styles.inputHeader}>Password:</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                        />
                        <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword}>
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>
                    <PrimaryButton label="Login" onPress={handleLogin}/>
                    <PrimaryButton label="Forgot Password?" onPress={handleForgotPassword}/>
                    <PrimaryButton label="Don't have an account?" onPress={handleCreateAccount} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer:{
        alignItems: 'center',
        marginBottom: 80,
    },
    image:{
        width: width * 0.8,
        height: (width * 0.8) * 0.5,
        resizeMode: 'contain',
    },
    inputContainer:{
        width: '80%',
        marginTop: -30,
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
        marginBottom: 10,
    },
    iconButton: {
        marginLeft: -50, 
    },
    inputHeader:{
        fontSize: 18,
    }
});