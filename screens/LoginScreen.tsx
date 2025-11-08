import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation();

    const [alreadyUser, setAlreadyUser] = useState(false);

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [newUsername, setNewUsername] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    const handleLogin = () => {
        if (!loginUsername || !loginPassword) {
            alert('Please enter both username and password');
            return;
        }
        console.log('User: ' + loginUsername +' logging in');
        navigation.reset({ index: 0, routes: [{ name: 'Home' as never }], } as never);
    };

    const handleSignUp = () => {
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
        console.log('User: ' + newUsername +' signing up');
        navigation.reset({ index: 0, routes: [{ name: 'Home' as never }], } as never);
    };

    const switchForm = () => {
        setAlreadyUser(!alreadyUser);
        
        setLoginUsername('');
        setLoginPassword('');

        setNewUsername('');
        setNewPassword1('');
        setNewPassword2('');
    };

    if (!alreadyUser){
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.innerContainer}>
                            <View style={styles.imageContainer}>
                                <Image source={require('./../assets/images/icon.png')} style={styles.image} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeader}>Username:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={loginUsername}
                                    onChangeText={setLoginUsername}
                                    returnKeyType="next"
                                />
                                <Text style={styles.inputHeader}>Password:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={loginPassword}
                                    onChangeText={setLoginPassword}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                                <Button title="Login" onPress={handleLogin} />
                                <Button title="Sign up" onPress={switchForm} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }else {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.innerContainer}>
                            <View style={styles.imageContainer}>
                                <Image source={require('./../assets/images/icon.png')} style={styles.image} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeader}>Username:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    returnKeyType="next"
                                />
                                <Text style={styles.inputHeader}>Password:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword1}
                                    onChangeText={setNewPassword1}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                                <Text style={styles.inputHeader}>Repeat password:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword2}
                                    onChangeText={setNewPassword2}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                                <Button title="Create account" onPress={handleSignUp} />
                                <Button title="I already have an account" onPress={switchForm} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7ff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 50, // Adjusted for better keyboard handling on Android
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 80, // Reduce margin to move inputs up
    },
    image: {
        width: width * 0.8,
        height: (width * 0.8) * 0.5, // Adjust aspect ratio as needed
        resizeMode: 'contain',
    },
    inputContainer: {
        width: '80%',
        marginTop: -30, // Move inputs higher for Android
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 5,
        backgroundColor: '#ffffffff',
    },
    inputHeader: {
        fontSize: 18,
    }
});