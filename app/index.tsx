import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import LoginScreen from './../screens/LoginScreen';

const Stack = createNativeStackNavigator();

function ScreenNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
      <ScreenNav/>
  );
}