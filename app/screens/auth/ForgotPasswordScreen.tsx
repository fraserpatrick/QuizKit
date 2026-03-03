import { useNavigation } from "expo-router";
import { useState } from "react";
import { Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, View, TextInput, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/Buttons";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const {resetPasswordWithEmail} = useAuth();

    const [email, setEmail] = useState('');

    const handleForgot = async () => {
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }

        console.log('Password reset requested for:', email);

        try {
            await resetPasswordWithEmail(email);
            alert('Password reset email sent. Please check your inbox.');
        } catch (error: any) {
            console.log('Password reset failed:', error);

            if (error.code === 'auth/invalid-email') {
                alert('Incorrect email.');
            } else {
                alert('Something went wrong. Please try again.');
            }
            setEmail('');
            return;
        }
        navigation.navigate('Login' as never);
    }

    const handleNavigateToLogin = () => {
        navigation.navigate('Login' as never);
    }

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
                            returnKeyType="done"
                            onSubmitEditing={handleForgot}
                        />
                        <PrimaryButton label="Send reset password email" onPress={handleForgot} />
                        <PrimaryButton label="Back to login" onPress={handleNavigateToLogin} />
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
    inputHeader:{
        fontSize: 18,
    }
});