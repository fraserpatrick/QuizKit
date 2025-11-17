import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button } from 'react-native';
import HomeScreen from './../screens/HomeScreen';
import LoginScreen from './../screens/LoginScreen';

const Stack = createNativeStackNavigator();

function ScreenNav() {
    const handleLogout = (navigation) => {
        alert('Logged out!');
        navigation.navigate('Login');
    };

    return (
        <Stack.Navigator screenOptions={({ navigation }) => ({headerRight: () => (
                    <Button title="Logout" onPress={() => handleLogout(navigation)}/>
                ),})}>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
    );
}

export default function Index() {
    return (
        <ScreenNav/>
    );
}