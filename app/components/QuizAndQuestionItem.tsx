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


export const QuestionItem = ({ question, onPress }: QuestionProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.buttonText}>{question.text}</Text>
            <AntDesign
                name="caret-right"
                size={24}
                color="#ffffff"
                style={styles.icon}
            />
        </View>
    </TouchableOpacity>
);

export const VariableQuestionItem = ({ question, onPress, correct }: QuestionProps & { correct: boolean }) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={[styles.item, correct ? styles.correctItem : styles.incorrectItem]}>
            <Text style={styles.buttonText}>{question.text}</Text>
            <AntDesign
                name="caret-right"
                size={24}
                color="#ffffff"
                style={styles.icon}
            />
        </View>
    </TouchableOpacity>
);

export const QuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.buttonText}>{quiz.title}</Text>
            <AntDesign
                name="caret-right"
                size={24}
                color="#ffffff"
                style={styles.icon}
            />
        </View>
    </TouchableOpacity>
);

export const SmallQuizItem = ({ quiz, onPress }: QuizProps) => (
    <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
        <View style={styles.item}>
            <Text style={styles.smallButtonText}>{quiz.title}</Text>
            <AntDesign
                name="caret-right"
                size={24}
                color="#ffffff"
                style={styles.icon}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
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
    icon: {
        position: 'absolute',
        right: 15,
    },
});