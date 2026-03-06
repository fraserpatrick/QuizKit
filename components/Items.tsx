import { Quiz, Question, User } from '@/components/Interfaces';
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "@/hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";
import { PrimaryColour, SecondaryColour } from '@/components/SelectedStyles';


type QuizProps = {
    quiz: Quiz;
    onPress: () => void;
};

type QuestionProps = {
    question: Question;
    onPress?: () => void;
}

type LeaderboardProps = {
    user: User;
    ranking: number;
    onPress: () => void;
    loggedIn: boolean;
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

const reorderIcon = () => {
    return (
        <AntDesign
            name="holder"
            size={24}
            color="#fff"
        />
    ) 
}


export const QuestionItem = ({ question, onPress, onLongPress, isActive, number }: QuestionProps & {onLongPress?: () => void; isActive?: boolean; number: number }) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity 
            onPress={() => { playClick(); onPress?.(); }}
            onLongPress={onLongPress}
        >
            <View style={[styles.item, isActive && { backgroundColor: PrimaryColour }]}>
                <Text style={styles.questionNumberText}>{number}.</Text>
                <Text style={styles.buttonText}>{question.text}</Text>
                {onLongPress ? reorderIcon() : iconItem()}
            </View>
        </TouchableOpacity>
    )
};

export const VariableQuestionItem = ({ question, onPress, correct }: QuestionProps & { correct: boolean }) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress?.(); }}>
            <View style={[styles.item, correct ? styles.correctItem : styles.incorrectItem]}>
                <Text
                    style={styles.buttonText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {question.text}
                </Text>

                <View style={styles.rightSection}>
                    <Text style={styles.questionPointsText}>
                        {correct ? '+10 pts' : '+0 pts'}
                    </Text>
                    {iconItem()}
                </View>
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


export const LeaderboardItem = ({ user, ranking, onPress, loggedIn }: LeaderboardProps) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={[styles.item, loggedIn && {backgroundColor: PrimaryColour}]}>
                <Text style={styles.rankingText}>{ranking}.</Text>
                <Text style={[styles.usernameText, loggedIn && {fontWeight: 'bold'}]}>{user.username} {loggedIn && '(you)'}</Text>
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
        backgroundColor: SecondaryColour,
        borderWidth: 1,
        marginTop: 8,
        marginHorizontal: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    icon: {
        marginLeft: 8,
    },
    buttonText: {
        flex: 1, 
        color: 'white',
        fontSize: 16,
        marginVertical: 10,
        fontWeight: 600
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
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    questionPointsText: {
        color: 'white',
        fontSize: 16,
        marginRight: 8,
    },
    questionNumberText: {
        width: 28,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
});