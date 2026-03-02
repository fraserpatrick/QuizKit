import { useRef, useState } from "react";
import { Text, StyleSheet, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createUser, getUserByUsername } from "@/api/users";
import { PrimaryButton } from "@/components/Buttons";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const {signUp, changeUsername} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const emailRef = useRef<TextInput>(null);
    const password1Ref = useRef<TextInput>(null);
    const password2Ref = useRef<TextInput>(null);


    const handleSignUp = async () => {
        if (loading) {
            return;
        }

        if (!username.trim() || !email.trim() || !password1.trim() || !password2.trim()) {
            alert('Please fill in all fields');
            return;
        }

        if (password1.trim() !== password2.trim()) {
            alert('Passwords do not match');
            setPassword1('');
            setPassword2('');
            return;
        }

        const newPassword = password1.trim();
        const pwValid = isPasswordValid(newPassword);

        if (!pwValid.minLength || !pwValid.hasUppercase || !pwValid.hasNumber || !pwValid.hasSpecialChar) {
            alert('Password does not meet requirements');
            setPassword1('');
            setPassword2('');
            return;
        }

        try {
            setLoading(true);

            const newUsername = username.trim().toLowerCase();
            const newEmail = email.trim().toLowerCase();

            const newUser = await getUserByUsername(newUsername);
            if (newUser !== null){
                alert('Username already in use');
                setUsername('');
                return;
            }

            await signUp(newEmail, newPassword);
            console.log('User account created & signed in!');

            await createUser(newEmail, newUsername);
            await changeUsername(newUsername);
        } catch (error: any) {
            console.log(error);

            if (error.code === 'auth/invalid-email') {
                alert('Invalid email address.');
            } else if (error.code === 'auth/email-already-in-use') {
                alert('Email already in use.')
            } else {
                alert('Something went wrong. Please try again.');
            }

            setEmail('');
            setPassword1('');
            setPassword2('');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToLogin = () => {
        navigation.navigate('Login' as never);
    }

    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const isPasswordValid = (pw: string) => ({
        minLength: pw.length >= 8,
        hasUppercase: /[A-Z]/.test(pw),
        hasNumber: /\d/.test(pw),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pw)
    });


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeader}>Username:</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="username"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                        />
                        <Text style={styles.inputHeader}>Email:</Text>
                        <TextInput
                            ref={emailRef}
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            returnKeyType="next"
                            onSubmitEditing={() => password1Ref.current?.focus()}
                        />
                        <Text style={styles.inputHeader}>Password:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                ref={password1Ref}
                                style={styles.passwordInput}
                                value={password1}
                                onChangeText={setPassword1}
                                secureTextEntry={!showPassword1}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                returnKeyType="next"
                                onSubmitEditing={() => password2Ref.current?.focus()}
                            />
                            <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword1}>
                                <MaterialCommunityIcons
                                    name={showPassword1 ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordRules}>
                            {Object.entries(isPasswordValid(password1)).map(([key, valid]) => (
                                <Text key={key} style={{ color: valid ? 'green' : 'red', fontSize: 12 }}>
                                    {key === 'minLength' ? 'At least 8 characters' :
                                    key === 'hasUppercase' ? 'Contains an uppercase letter' :
                                    key === 'hasNumber' ? 'Contains a number' : 
                                    key ==='hasSpecialChar' ? 'Contains a special character' : ''}
                                </Text>
                            ))}
                        </View>
                        <Text style={styles.inputHeader}>Repeat password:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                ref={password2Ref}
                                style={styles.passwordInput}
                                value={password2}
                                onChangeText={setPassword2}
                                secureTextEntry={!showPassword2}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                returnKeyType="done"
                                onSubmitEditing={handleSignUp}
                            />
                            <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword2}>
                                <MaterialCommunityIcons
                                    name={showPassword2 ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <PrimaryButton label={loading ? 'Creating account...' : 'Create account'} onPress={handleSignUp} />
                        <PrimaryButton label="I already have an account" onPress={handleNavigateToLogin} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    inputContainer:{
        padding: 10
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
    buttonsContainer:{
        marginTop: 10
    },
    iconButton: {
        padding: 5, 
    },
    inputHeader:{
        fontSize: 18,
        marginBottom: 3
    },
    passwordRules: {
        marginBottom: 8,
    },
});