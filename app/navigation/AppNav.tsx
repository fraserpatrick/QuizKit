import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizCreationScreen from '../screens/QuizCreationScreen';
import QuizEditor from '../screens/QuizEditor';
import AdminScreen from '../screens/AdminScreen';
import QuizInfoScreen from '../screens/QuizInfoScreen';
import { Button } from 'react-native';
import { useAuth } from "@/app/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNav() {
    const { logout } = useAuth();

    const homeScreenOptions = ({navigation}) => ({
        title: 'QuizKit',
        headerRight: () => (
            <Button title="Logout" onPress={() => handleLogout()} />
        ),
        headerLeft: () => (
            <Button title="ADMIN" onPress={() => handleAdmin(navigation)} />
        ),
    });

    const handleLogout = () => {
        console.log('Logout button pressed');
        alert('Logging out...');
        logout();
    }
    const handleAdmin = (navigation) => {
        navigation.navigate('AdminScreen' as never);
    }



    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} />
            <Stack.Screen name="QuizInfoScreen" component={QuizInfoScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
        </Stack.Navigator>
    );
}