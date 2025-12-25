import { useNavigation } from '@react-navigation/native';
import { navigate } from 'expo-router/build/global-state/routing';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();

    const handleCreateQuestions = () => {
        navigation.navigate('QuestionEditor', { passedQuestion: null } as never);
    };


    return (
        <View style={styles.container}>
            <View style={styles.questionsContainer}>

            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleCreateQuestions} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Create new question</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    questionsContainer:{
        flex: 0.9,
    },
    buttonsContainer:{
        flex: 0.1,
    },
    button:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
        borderWidth: 2,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
});