import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizCreationScreen from '../screens/quizScreens/QuizCreationScreen';
import QuizEditor from '../screens/quizScreens/QuizEditor';
import ProfileScreen from '../screens/ProfileScreen';
import QuizInfoScreen from '../screens/quizScreens/QuizInfoScreen';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNav() {

    const homeScreenOptions = ({navigation}) => ({
        title: 'QuizKit',
        headerRight: () => (
            <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen' as never)} />
        )
    });


    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} />
            <Stack.Screen name="QuizInfoScreen" component={QuizInfoScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    );
}