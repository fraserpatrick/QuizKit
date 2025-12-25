import { View, Text } from "react-native";

export default function QuestionEditor({route}: any) {
    const {passedQuestion} = route.params;

    return (
        <View>
            <Text>Question Editor Screen</Text>
        </View>
    );
}