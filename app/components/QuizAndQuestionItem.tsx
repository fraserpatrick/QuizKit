import { Question, Quiz } from "@/DatabaseController";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "../hooks/useSounds";

const {playClick} = useSounds();

type QuizProps = {
    quiz: Quiz;
    onPress: () => void;
};

type QuestionProps = {
    question: Question;
    onPress: () => void;
}


export const QuestionItem = ({ question, onPress }: QuestionProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }} style={styles.item}>
        <View>
            <Text style={styles.buttonText}>{question.text}</Text>
        </View>
    </TouchableOpacity>
);

export const VariableQuestionItem = ({ question, onPress, correct }: QuestionProps & { correct: boolean }) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }} style={[styles.item, correct ? styles.correctItem : styles.incorrectItem]}>
        <View>
            <Text style={styles.buttonText}>{question.text}</Text>
        </View>
    </TouchableOpacity>
);

export const QuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }} style={styles.item}>
        <View>
            <Text style={styles.buttonText}>{quiz.title}</Text>
        </View>
    </TouchableOpacity>
);

export const SmallQuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }} style={styles.item}>
        <View>
            <Text style={styles.smallButtonText}>{quiz.title}</Text>
        </View>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
    smallButtonText:{
        textAlign: 'center',
        padding: 5,
        color: 'white',
        fontSize: 16,
    },
    item:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
        borderWidth: 1,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
    },
    correctItem:{
        backgroundColor: '#00c400ff',
    },
    incorrectItem:{
        backgroundColor: '#db0000',
    },
});