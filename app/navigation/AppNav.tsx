import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizCreationScreen from '../screens/quizScreens/QuizCreationScreen';
import QuizEditor from '../screens/quizScreens/QuizEditor';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import ProfileEditor from '../screens/profileScreens/ProfileEditor';
import QuizInfoScreen from '../screens/quizScreens/QuizInfoScreen';
import QuestionEditor from '../screens/quizScreens/QuestionEditor';
import QuizInfoEditor from '../screens/quizScreens/QuizInfoEditor';
import QuizPlayer from '../screens/quizScreens/QuizPlayer';

const Stack = createNativeStackNavigator();

export default function AppNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="QuizCreationScreen" component={QuizCreationScreen} />
            <Stack.Screen name="QuizInfoScreen" component={QuizInfoScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
            <Stack.Screen name="QuestionEditor" component={QuestionEditor} />
            <Stack.Screen name="QuizInfoEditor" component={QuizInfoEditor} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProfileEditor" component={ProfileEditor} />
            <Stack.Screen name="QuizPlayer" component={QuizPlayer} />
        </Stack.Navigator>
    );
}