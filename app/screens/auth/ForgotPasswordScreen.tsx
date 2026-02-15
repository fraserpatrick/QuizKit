import { useNavigation } from "expo-router";
import { useState } from "react";
import { Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from "@/app/AuthContext";
import PrimaryButton from "@/app/components/Button";

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
            resetPassword(email);
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
                        returnKeyType="done"
                    />
                    <PrimaryButton label="Send reset password email" onPress={handleForgot} />
                    <PrimaryButton label="Back to login" onPress={handleNavigateToLogin} />
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
    inputHeader:{
        fontSize: 18,
    }
});