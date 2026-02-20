import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/app/screens/auth/LoginScreen';
import SignUpScreen from '@/app/screens/auth/SignUpScreen';
import ForgotPasswordScreen from '@/app/screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}