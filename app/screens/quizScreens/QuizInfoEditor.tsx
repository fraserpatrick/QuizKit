import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { View, Text, Button } from "react-native";

export default function QuizInfoEditor({route}: any) {
    const {passedQuiz} = route.params;
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Quiz info editor',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            )
        });
    }, []);


    return (
        <View>
            <Text>Quiz Info Editor Screen</Text>
        </View>
    );
}