import { View, Text } from "react-native";

export default function QuizInfoEditor({route}: any) {
    const {passedQuiz} = route.params;

    return (
        <View>
            <Text>Quiz Info Editor Screen</Text>
        </View>
    );
}