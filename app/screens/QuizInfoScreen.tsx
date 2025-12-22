import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import database from './../../DatabaseController';

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


    const handleQuizDelete = () => Alert.alert(
        'Delete Quiz', 'Are you sure you want to delete this quiz?', [
            {text: 'No, keep it', style: 'cancel',},
            {text: 'Yes, delete it', onPress: () => deleteQuiz(), style: 'destructive',},
    ]);

    const deleteQuiz = () => {
        console.log('Deleting quiz with id: ' + passedQuiz.id);
        try{
            database.deleteQuiz(passedQuiz.id);
            alert('Deleted quiz : ' + passedQuiz.name);
        }
        catch(error){
            console.error('Error deleting quiz: ', error);
            alert('Failed to delete quiz.');
            return;
        }
        navigation.reset({index: 0, routes: [{name: 'Home' as never} as never,],} as never);
    }


    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.header}>Title: {passedQuiz.name}</Text>
                <Text style={styles.header}>Owner:</Text>
                <Text style={styles.header}>Description: {passedQuiz.description}</Text>
                <Text style={styles.header}>Visibility: {passedQuiz.visibility}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={navToPlayer} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Play quiz</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={navToEditor} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Edit quiz</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleQuizDelete} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Delete quiz</Text>
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
    infoContainer:{
        flex: 0.7,
    },
    buttonsContainer:{
        flex: 0.2,
        marginBottom: 0,
    },
    header:{
        fontSize: 24,
        marginBottom: 10,
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