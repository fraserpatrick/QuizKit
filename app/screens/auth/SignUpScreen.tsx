import { useState } from "react";
import { Text, StyleSheet, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createUser } from "@/api/users";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const {signUp, changeUsername} = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSignUp = async () => {
        if (!username.trim() || !email.trim() || !password1.trim() || !password2.trim()) {
            alert('Please fill in all fields');
            return;
        }

        if (password1 !== password2) {
            alert('Passwords do not match');
            setPassword1('');
            setPassword2('');
            return;
        }

        if (password1.trim().length < 6) {
            alert('Password must be at least 6 characters long.');
            setPassword1('');
            setPassword2('');
            return;
        }

        if (password1.trim().toLowerCase() === password1.trim()) {
            alert('Password must contain at least one uppercase letter.');
            setPassword1('');
            setPassword2('');
            return;
        }

        try {
            const newUser = await signUp(email.trim().toLowerCase(), password1.trim());
            console.log('User account created & signed in!', newUser.email);
            changeUsername(username.trim().toLowerCase());
        }
        catch (error) {
            console.error('Sign up failed:', error);
            alert('Sign up failed. Please try again.');
            setEmail('');
            setPassword1('');
            setPassword2('');
        }
        try {
            await createUser(email.trim().toLowerCase(), username.trim().toLowerCase());
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

    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeader}>Username:</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            returnKeyType="next"
                        />
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
                                value={password1}
                                onChangeText={setPassword1}
                                secureTextEntry={!showPassword1}
                                returnKeyType="next"
                            />
                            <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword1}>
                                <MaterialCommunityIcons
                                    name={showPassword1 ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.inputHeader}>Repeat password:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password2}
                                onChangeText={setPassword2}
                                secureTextEntry={!showPassword2}
                                returnKeyType="next"
                            />
                            <TouchableOpacity style={styles.iconButton} onPress={toggleShowPassword2}>
                                <MaterialCommunityIcons
                                    name={showPassword2 ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleSignUp} >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Create account</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNavigateToLogin} >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>I already have an account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
    },
    container:{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer:{
        width: '100%',
        alignItems: 'center',
        paddingBottom: 50,
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