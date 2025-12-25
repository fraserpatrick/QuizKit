import { Text, View } from 'react-native';

export default function QuizEditor({route}: any) {
    const {passedQuiz} = route.params;


        return (
            <View>
                <Text>{passedQuiz.id}</Text>
                <Text>{passedQuiz.title}</Text>
            </View>
        );
}