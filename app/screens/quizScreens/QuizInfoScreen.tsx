import { useNavigation } from '@react-navigation/native';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
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
                <Button title="< Back" onPress={() => navigation.goBack()} />
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
    }, [navigation, ownedByUser, passedQuiz]);


    const quizDeleteAlert = () => {
        playNotification();
        setDeleteModalVisible(true);
    };

    const handleDeleteQuiz = async () => {
        setDeleteModalVisible(false);
        console.log('Deleting quiz with id: ' + passedQuiz.id);
        try{
            if (passedQuiz.saveType === 'local'){
                await deleteLocalQuiz(passedQuiz.id);
            } else if (passedQuiz.saveType === 'cloud'){
                await deleteQuiz(passedQuiz.id);
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
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
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
                            <Text style={styles.contentText}>{passedQuiz.description}</Text>
                        </View>
                    )}
                    {ownedByUser && (<>
                        <View style={styles.itemContainer}>
                            <Text style={styles.header}>Save Location</Text>
                            <Text style={styles.contentText}>{passedQuiz.saveType}</Text>
                        </View>
                    
                        {passedQuiz.saveType === "cloud" && (
                            <View style={styles.itemContainer}>
                                <Text style={styles.header}>Visibility</Text>
                                <Text style={styles.contentText}>{passedQuiz.visibility}</Text>
                            </View>
                        )}
                    </>)}
                </View>
            </ScrollView>

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
        marginTop: 10,
        paddingHorizontal: 20
    },
    itemContainer:{
        padding: 10,
        backgroundColor: '#c9c9c9',
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 15,
    },
    header:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    quizTitle:{
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentText: {
        fontSize: 16,
        lineHeight: 22,
    },
});