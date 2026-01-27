import { useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function QuizPlayerSummary({ route }: any) {
    const {question} = route.params;
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Results Summary',
            headerLeft: () => (
                <Button title="< Back" onPress={() => navigation.goBack()} />
            ),
        });
    }, [navigation]);
    

    return(
        <View style={styles.container}>
            <Text> {question.text}</Text>
        </View>
    )
};

const styles = StyleSheet.create ({
    container:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
});