import { Quiz, Question, User } from '@/app/components/Interfaces';
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "@/app/hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";


type QuizProps = {
    quiz: Quiz;
    onPress: () => void;
};

type QuestionProps = {
    question: Question;
    onPress: () => void;
}

type LeaderboardProps = {
    user: User;
    ranking: number;
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

const saveIcon = (saveType: string) => {
    return (
        <AntDesign
            name={saveType === "local" ? 'download' : 'cloud'}
            size={24}
            color="#ffffff"
            style={{ marginRight: 6 }}
        />
    );
}


export const QuestionItem = ({ question, onPress }: QuestionProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.item}>
                <Text style={styles.buttonText}>{question.text}</Text>
                {iconItem()}
            </View>
        </TouchableOpacity>
    )
};

export const VariableQuestionItem = ({ question, onPress, correct }: QuestionProps & { correct: boolean }) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={[styles.item, correct ? styles.correctItem : styles.incorrectItem]}>
                <Text style={styles.buttonText}>{question.text}</Text>
                {iconItem()}
            </View>
        </TouchableOpacity>
    )
};


export const QuizItem = ({ quiz, onPress }: QuizProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.item}>
                <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">{quiz.title}</Text>
                {iconItem()}
            </View>
        </TouchableOpacity>
    )
};

export const OwnedQuizItem = ({ quiz, onPress }: QuizProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.item}>
                {saveIcon(quiz.saveType)}
                <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">{quiz.title}</Text>
                {iconItem()}
            </View>
        </TouchableOpacity>
    )
};

export const SmallQuizItem = ({ quiz, onPress }: QuizProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.item}>
                <Text style={styles.smallButtonText} numberOfLines={1} ellipsizeMode="tail">{quiz.title}</Text>
                {iconItem(20)}
            </View>
        </TouchableOpacity>
    )
};


export const LeaderboardItem = ({ user, ranking, onPress }: LeaderboardProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.item}>
                <Text style={styles.rankingText}>{ranking}.</Text>
                <Text style={styles.usernameText}>{user.username}</Text>
                <Text style={styles.pointsText}>{user.points} points</Text>
                {iconItem()}
            </View>
        </TouchableOpacity>
    )
};


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
    icon: {
        marginLeft: 8,
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
    correctItem:{
        backgroundColor: '#00c400ff',
    },
    incorrectItem:{
        backgroundColor: '#db0000',
    },
    rankingText: {
        flex: 0.1,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 10,
    },
    usernameText: {
        flex: 0.4,
        fontSize: 16,
        color: 'white',
        marginLeft: 8,
    },
    pointsText: {
        flex: 0.5,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
});