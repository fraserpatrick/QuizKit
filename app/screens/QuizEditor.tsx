import { Text, View } from 'react-native';

export default function QuizEditor({route}: any) {
    const {loggedInUsername, passedQuizID, quizName} = route.params;


        return (
            <View>
                <Text>{loggedInUsername}</Text>
                <Text>{passedQuizID}</Text>
                <Text>{quizName}</Text>
            </View>
        );
}