import { Question, Quiz } from "@/DatabaseController";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "../hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";

const {playClick} = useSounds();

type QuizProps = {
    quiz: Quiz;
    onPress: () => void;
};

type QuestionProps = {
    question: Question;
    onPress: () => void;
}

const iconItem = (size: number = 24) => {
    return (
        <AntDesign
            name="caret-right"
            size={size}
            color="#ffffff"
        />
    );
}


export const QuestionItem = ({ question, onPress }: QuestionProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.buttonText}>{question.text}</Text>
            {iconItem()}
        </View>
    </TouchableOpacity>
);

export const VariableQuestionItem = ({ question, onPress, correct }: QuestionProps & { correct: boolean }) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={[styles.item, correct ? styles.correctItem : styles.incorrectItem]}>
            <Text style={styles.buttonText}>{question.text}</Text>
            {iconItem()}
        </View>
    </TouchableOpacity>
);

export const QuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">{quiz.title}</Text>
            {iconItem()}
        </View>
    </TouchableOpacity>
);

export const SmallQuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.smallButtonText} numberOfLines={1} ellipsizeMode="tail">{quiz.title}</Text>
            {iconItem(20)}
        </View>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FF6B00',
        borderWidth: 1,
        marginTop: 4,
        marginHorizontal: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonText: {
        flex: 1, 
        color: 'white',
        fontSize: 16,
        marginVertical: 10,
    },
    smallButtonText: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        marginVertical: 5,
    },
    icon: {
        marginLeft: 8,
    },
    correctItem:{
        backgroundColor: '#00c400ff',
    },
    incorrectItem:{
        backgroundColor: '#db0000',
    },
});