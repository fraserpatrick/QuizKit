import { useState } from "react";
import { Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, View, TextInput, TouchableOpacity, Dimensions } from "react-native";
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
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={require('./../../../assets/images/icon.png')} style={styles.image} />
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
                        <TextInput
                            style={styles.input}
                            value={password1}
                            onChangeText={setPassword1}
                            secureTextEntry
                            returnKeyType="next"
                        />
                        <Text style={styles.inputHeader}>Repeat password:</Text>
                        <TextInput
                            style={styles.input}
                            value={password2}
                            onChangeText={setPassword2}
                            secureTextEntry
                            returnKeyType="next"
                        />
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
            </TouchableWithoutFeedback>
        </View>
    );
}


const { width } = Dimensions.get('window');
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