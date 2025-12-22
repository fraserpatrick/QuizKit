import { useNavigation } from '@react-navigation/native';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styles from './../../assets/images/Styles';

export default function QuizInfoScreen({route}: any) {
    const navigation = useNavigation();
    const {passedQuiz} = route.params;


    const navToPlayer = () => {
        console.log('Navigating to Quiz Player');
    }

    const navToEditor = () => {
        console.log('Navigating to Quiz Editor');
        navigation.navigate('QuizEditor' as never, { passedQuiz: passedQuiz } as never);
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
                            <Image source={require('./../../assets/images/icon.png')} style={styles.loginScreen_image} />
                        </View>
                        <View style={styles.loginScreen_inputContainer}>
                            <TouchableOpacity onPress={navToPlayer} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Play quiz</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navToEditor} >
                                <View style={styles.loginScreen_button}>
                                    <Text style={styles.loginScreen_buttonText}>Edit quiz</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}