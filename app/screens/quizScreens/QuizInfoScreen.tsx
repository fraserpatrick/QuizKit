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
            title: 'Quiz information',
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
        navigation.navigate('QuizPlayer', { passedQuiz: passedQuiz });
    }

    const navToEditor = () => {
        navigation.navigate('QuizEditor', { passedQuiz: passedQuiz });
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
                <View style={styles.itemContainer}>
                    <Text style={styles.quizTitle}>{passedQuiz.title}</Text>    
                </View>            
                {!ownedByUser && (
                    <View style={styles.itemContainer}>
                        <Text style={styles.header}>Created by:</Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileScreen', { passedUsername: passedQuiz.owner })}}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{passedQuiz.owner}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                {passedQuiz.description && (
                    <View style={styles.itemContainer}>
                        <Text style={styles.header}>Description</Text>
                        <Text>{passedQuiz.description}</Text>
                    </View>
                )}
                {ownedByUser && (
                    <View style={styles.itemContainer}>
                        <Text style={styles.header}>Visibility</Text>
                        <Text>{passedQuiz.visibility}</Text>
                    </View>
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
    itemContainer:{
        padding: 5,
        backgroundColor: '#c9c9c9',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonsContainer:{
        flex: 0.1,
        marginBottom: 0,
    },
    header:{
        fontSize: 24,
        marginBottom: 5,
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
    quizTitle:{
        fontSize: 28,
        textAlign: 'center',
    },
    userButton:{
        borderWidth: 2,
        alignSelf: 'flex-end',
        backgroundColor: '#7a7a7aff',
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
    }
});