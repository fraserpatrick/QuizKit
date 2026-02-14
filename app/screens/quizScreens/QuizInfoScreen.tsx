import { useNavigation } from '@react-navigation/native';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useLayoutEffect } from 'react';
import PrimaryButton from '@/app/components/Button';
import { useAuth } from '@/app/AuthContext';
import { deleteQuiz } from '@/api/quizzes';
import { deleteQuestions } from '@/api/questions';
import { sounds } from '@/app/hooks/sounds';


export default function QuizInfoScreen({route}: any) {
    const navigation = useNavigation();
    const {passedQuiz} = route.params;
    const { username } = useAuth();
    const ownedByUser = passedQuiz.owner === username;
    const {playNotification} = sounds();
    
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


    const quizDeleteAlert = () => {
        playNotification();
        Alert.alert(
            'Delete Quiz', 'Are you sure you want to delete this quiz?', [
                {text: 'No, keep it', style: 'cancel',},
                {text: 'Yes, delete it', onPress: () => handleDeleteQuiz(), style: 'destructive',},
        ]);
    };

    const handleDeleteQuiz = () => {
        console.log('Deleting quiz with id: ' + passedQuiz.id);
        try{
            deleteQuiz(passedQuiz.id);
            deleteQuestions(passedQuiz.id);
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
                        <PrimaryButton label={passedQuiz.owner} onPress={() => navigation.navigate('ProfileScreen', { passedUsername: passedQuiz.owner })}/>
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
                <PrimaryButton label="Play quiz" onPress={() => navigation.navigate('QuizPlayer', { passedQuiz: passedQuiz })}/>
                {ownedByUser && (<>
                    <PrimaryButton label="Edit questions" onPress={() => navigation.navigate('QuizEditor', { passedQuiz: passedQuiz })}/>
                    <PrimaryButton label="Delete quiz" onPress={quizDeleteAlert}/>
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