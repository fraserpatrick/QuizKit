import { Text, View } from 'react-native';

export default function QuizEditor({route}: any) {
    const { passedQuizID, quizName} = route.params;


        return (
            <View>
                <Text>{passedQuizID}</Text>
                <Text>{quizName}</Text>
            </View>
        );
}