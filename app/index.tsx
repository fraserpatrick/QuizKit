import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button } from 'react-native';
import AdminScreen from './../screens/AdminScreen';
import HomeScreen from './../screens/HomeScreen';
import LoginScreen from './../screens/LoginScreen';
import QuizCreationScreen from './../screens/QuizCreationScreen';
import QuizEditor from './../screens/QuizEditor';

const Stack = createNativeStackNavigator();

function ScreenNav() {
    const handleLogout = (navigation: any) => {
        alert('Logged out!');
        navigation.navigate('Login');
    };

    const handleAdmin = (navigation: any) => {
        navigation.navigate('Admin');
    };

    const homeScreenOptions = ({navigation}) => ({
        title: 'QuizKit',
        headerRight: () => (
            <Button title="Logout" onPress={() => handleLogout(navigation)} />
        ),
        headerLeft: () => (
            <Button title="ADMIN" onPress={() => handleAdmin(navigation)} />
        ),
    });

    const quizEditorScreenOptions = () => ({
        headerBackTitle: 'Exit',
    }); 

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
            <Stack.Screen name="Admin" component={AdminScreen}/>
            <Stack.Screen name="QuizEditor" component={QuizEditor} options={quizEditorScreenOptions}/>
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} options={quizEditorScreenOptions}/>
        </Stack.Navigator>
    );
}

export default function Index() {
    return <ScreenNav />;
}