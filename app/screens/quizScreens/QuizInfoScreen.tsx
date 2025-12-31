import { useNavigation } from '@react-navigation/native';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import database from '@/DatabaseController';
import { useAuth } from '@/app/AuthContext';
import { useLayoutEffect } from 'react';

export default function QuizInfoScreen({route}: any) {
    const navigation = useNavigation();
    const {passedQuiz} = route.params;
    const { username } = useAuth();
    const ownedByUser = passedQuiz.owner === username;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Quiz info',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            ),
            headerRight: ownedByUser? () => (
                <Button
                    title="Settings"
                    onPress={() =>
                        navigation.navigate('QuizInfoEditor', { passedQuiz })
                    }
                />
            ): undefined
        });
    }, []);


    const navToPlayer = () => {
        navigation.navigate('QuizPlayer' as never, { passedQuiz: passedQuiz } as never);
    }

    const navToEditor = () => {
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
            alert('Deleted quiz : ' + passedQuiz.title);
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
            <View style={ownedByUser ? {flex: 0.74} : {flex: 0.9}}>
                <Text style={styles.header}>Title: {passedQuiz.title}</Text>
                {!ownedByUser && (
                    <Text style={styles.header}>Owner:
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileScreen' as never, { passedUsername: passedQuiz.owner } as never)}}>
                            <Text style={styles.inlineButtonText}>{passedQuiz.owner}</Text>
                        </TouchableOpacity>
                    </Text>
                )}
                <Text style={styles.header}>Description: {passedQuiz.description}</Text>
                {ownedByUser && (
                    <Text style={styles.header}>Visibility: {passedQuiz.visibility}</Text>
                )}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={navToPlayer} >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Play quiz</Text>
                    </View>
                </TouchableOpacity>
                {ownedByUser && (<>
                    <TouchableOpacity onPress={navToEditor} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Edit questions</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleQuizDelete} >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Delete quiz</Text>
                        </View>
                    </TouchableOpacity>
                </>)}
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
    buttonsContainer:{
        flex: 0.1,
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
    inlineButtonText:{
        fontSize: 24,
        textDecorationLine: 'underline',
        textAlignVertical: 'center',
    },
});