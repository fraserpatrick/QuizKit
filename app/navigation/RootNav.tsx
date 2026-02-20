import { useAuth } from '@/app/AuthContext';
import AppNavigator from '@/app/navigation/AppNav';
import AuthNavigator from '@/app/navigation/AuthNav';

export default function RootNavigator() {
    const { isAuthenticated } = useAuth();

    return (
        isAuthenticated ? <AppNavigator /> : <AuthNavigator />
    );
}