import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizCreationScreen from '../screens/quizScreens/QuizCreationScreen';
import QuizEditor from '../screens/quizScreens/QuizEditor';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditor from '../screens/ProfileEditor';
import QuizInfoScreen from '../screens/quizScreens/QuizInfoScreen';
import { Alert, Button } from 'react-native';
import { useAuth } from '@/app/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNav() {
    const { logout } = useAuth();

    const homeScreenOptions = ({navigation}) => ({
        title: 'QuizKit',
        headerRight: () => (
            <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen' as never)} />
        )
    });
    
    const profileScreenOptions = () => ({
        headerRight: () => (
            <Button title="Logout" onPress={handleLogout} />
        )
    });

    const handleLogout = () => Alert.alert(
        'Logout', 'Are you sure you want to logout?', [
            {text: 'No, stay logged in', style: 'cancel',},
            {text: 'Yes, logout', onPress: () => logout(), style: 'destructive',},
        ]
    );


    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} />
            <Stack.Screen name="QuizInfoScreen" component={QuizInfoScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={profileScreenOptions} />
            <Stack.Screen name="ProfileEditor" component={ProfileEditor} />
        </Stack.Navigator>
    );
}