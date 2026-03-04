import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { PrimaryButtonWithIcon } from '@/components/Buttons';
import { useAuth } from '@/context/AuthContext';
import { deleteQuiz } from '@/api/quizzes';
import { deleteLocalQuiz } from '@/localDatabase/quizzes';
import { useSounds } from '@/hooks/useSounds';
import { DestructiveModal } from '@/components/Modal';


export default function QuizInfoScreen({route}: any) {
    const navigation = useNavigation();
    const {passedQuiz} = route.params;
    const { username } = useAuth();
    const ownedByUser = passedQuiz.owner === username;
    const {playNotification} = useSounds();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    
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
        setDeleteModalVisible(true);
    };

    const handleDeleteQuiz = () => {
        console.log('Deleting quiz with id: ' + passedQuiz.id);
        try{
            if (passedQuiz.saveType === 'local'){
                deleteLocalQuiz(passedQuiz.id);
            } else if (passedQuiz.saveType === 'cloud'){
                deleteQuiz(passedQuiz.id);
            }

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
                        <PrimaryButtonWithIcon label={passedQuiz.owner} icon="user" onPress={() => navigation.navigate('ProfileScreen', { passedUsername: passedQuiz.owner })}/>
                    </View>
                )}
                {passedQuiz.description && (
                    <View style={styles.itemContainer}>
                        <Text style={styles.header}>Description</Text>
                        <Text>{passedQuiz.description}</Text>
                    </View>
                )}
                {ownedByUser && (<>
                    <View style={styles.itemContainer}>
                        <Text style={styles.header}>Save Location</Text>
                        <Text>{passedQuiz.saveType}</Text>
                    </View>
                
                    {passedQuiz.saveType === "cloud" && (
                        <View style={styles.itemContainer}>
                            <Text style={styles.header}>Visibility</Text>
                            <Text>{passedQuiz.visibility}</Text>
                        </View>
                    )}
                </>)}
            </View>
            <View style={styles.buttonsContainer}>
                <PrimaryButtonWithIcon label="Play quiz" icon="play-circle" onPress={() => navigation.navigate('QuizPlayer', { passedQuiz: passedQuiz })}/>
                {ownedByUser && (<>
                    <PrimaryButtonWithIcon label="Edit questions" icon="edit" onPress={() => navigation.navigate('QuizEditor', { passedQuiz: passedQuiz })}/>
                    <PrimaryButtonWithIcon label="Delete quiz" icon="delete" onPress={quizDeleteAlert}/>
                </>)}
            </View>

            <DestructiveModal
                visible={deleteModalVisible}
                titleText='Delete Quiz'
                infoText='Are you sure you want to delete this quiz?'
                cancelText='No, keep it'
                confirmText='Yes, delete it'
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={handleDeleteQuiz}
            />
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
    quizTitle:{
        fontSize: 28,
        textAlign: 'center',
    },
});