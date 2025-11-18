import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button } from 'react-native';
import AdminScreen from './../screens/AdminScreen';
import HomeScreen from './../screens/HomeScreen';
import LoginScreen from './../screens/LoginScreen';

const Stack = createNativeStackNavigator();

function ScreenNav() {
    const handleLogout = (navigation) => {
        alert('Logged out!');
        navigation.navigate('Login');
    };

    const handleAdmin = (navigation) => {
        navigation.navigate('Admin');
    };

    return (
        <Stack.Navigator screenOptions={({ navigation }) => ({headerRight: () => (
                    <Button title="Logout" onPress={() => handleLogout(navigation)}/>
                ),headerLeft: () => (
                    <Button title="ADMIN" onPress={() => handleAdmin(navigation)}/>
                ),})}>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen} options={{title: "QuizKit"}}/>
            <Stack.Screen name="Admin" component={AdminScreen}/>
        </Stack.Navigator>
    );
}

export default function Index() {
    return (
        <ScreenNav/>
    );
}