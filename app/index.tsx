import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from './../screens/HomeScreen';
import LoginScreen from './../screens/LoginScreen';

const Stack = createNativeStackNavigator();

function ScreenNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
      <ScreenNav/>
  );
}