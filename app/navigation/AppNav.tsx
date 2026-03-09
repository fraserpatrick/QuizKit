import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/app/screens/HomeScreen';
import QuizEditor from '@/app/screens/quizScreens/editors/QuizEditor';
import ProfileScreen from '@/app/screens/profileScreens/ProfileScreen';
import ProfileEditor from '@/app/screens/profileScreens/ProfileEditor';
import QuizInfoScreen from '@/app/screens/quizScreens/QuizInfoScreen';
import QuestionEditor from '@/app/screens/quizScreens/editors/QuestionEditor';
import QuizInfoEditor from '@/app/screens/quizScreens/editors/QuizInfoEditor';
import QuizPlayer from '@/app/screens/quizScreens/QuizPlayer';
import QuizPlayerSummary from '@/app/screens/quizScreens/QuizPlayerSummary';
import QuestionReview from '@/app/screens/quizScreens/QuestionReview';
import { PrimaryColour } from '@/components/SelectedStyles';

const Stack = createStackNavigator();

export default function AppNav() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: PrimaryColour,
                    height: 70,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerStatusBarHeight: 2
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="QuizInfoScreen" component={QuizInfoScreen} />
            <Stack.Screen name="QuizEditor" component={QuizEditor} />
            <Stack.Screen name="QuestionEditor" component={QuestionEditor} />
            <Stack.Screen name="QuizInfoEditor" component={QuizInfoEditor} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProfileEditor" component={ProfileEditor} />
            <Stack.Screen name="QuizPlayer" component={QuizPlayer} />
            <Stack.Screen name="QuizPlayerSummary" component={QuizPlayerSummary} />
            <Stack.Screen name="QuestionReview" component={QuestionReview} />
        </Stack.Navigator>
    );
}