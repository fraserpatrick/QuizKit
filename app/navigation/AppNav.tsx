import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizCreationScreen from '../screens/QuizCreationScreen';
import QuizEditor from '../screens/QuizEditor';

const Stack = createNativeStackNavigator();

export default function AppNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
        </Stack.Navigator>
    );
}