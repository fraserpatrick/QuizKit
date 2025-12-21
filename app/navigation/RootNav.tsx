import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import AppNavigator from './AppNav';
import AuthNavigator from './AuthNav';

export default function RootNavigator() {
    const { isAuthenticated } = useAuth();

    return (
        isAuthenticated ? <AppNavigator /> : <AuthNavigator />
    );
}