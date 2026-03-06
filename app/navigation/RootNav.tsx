import { useAuth } from '@/context/AuthContext';
import AppNavigator from '@/app/navigation/AppNav';
import AuthNavigator from '@/app/navigation/AuthNav';
import { View, ActivityIndicator, Text } from 'react-native';
import { SecondaryColour } from '@/components/SelectedStyles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={SecondaryColour} />
                <Text style={{ marginTop: 15, fontSize: 18 }}>
                    Checking authentication...
                </Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </GestureHandlerRootView>
    );
}