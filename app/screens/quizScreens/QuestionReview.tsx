import { useLayoutEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ImageModal } from "@/components/Modal";
import { SecondaryColour } from "@/components/SelectedStyles";

export default function QuizPlayerSummary({ route }: any) {
    const {question, passedQuiz} = route.params;
    const navigation = useNavigation();
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);


    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Question Summary',
            headerLeft: () => (
                <Button title="< Back" onPress={navigation.goBack} />
            ),
        });
    }, [navigation]);

    const feedback = question.feedback || "No feedback was provided.";
    const correct = question.correctAnswer == question.userAnswer;

    const formatAnswer = (answer: string | null | undefined) => {
        if (!answer) return "";

        try {
            const parsed = JSON.parse(answer);

            if (Array.isArray(parsed)) {
                return parsed.join(", ");
            }

            return String(parsed);
        } catch {
            return String(answer);
        }
    };


    const QuizImage = ({ imageUri, saveType }: { imageUri: string; saveType: 'cloud' | 'local' }) => {
        const [loading, setLoading] = useState<boolean>(true);

        if (!imageUri) {
            return null;
        }

        let uri = imageUri;
        const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

        if (saveType === 'cloud') {
            uri = baseUrl + 'uploads/' + imageUri;
        }

        return (
            <TouchableOpacity onPress={() => setImagePreviewVisible(true)} activeOpacity={0.8}>
                <View style={styles.imageWrapper}>

                    {loading && (
                        <ActivityIndicator 
                        size="large" 
                        color={SecondaryColour}
                        style={styles.loader}
                        />
                    )}

                    <Image 
                        source={{ uri }}
                        style={styles.image}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                </View>
            </TouchableOpacity>
        )
    }; 


    return(
        <View style={styles.container}>
            <View style={styles.sectionContainer}>
                <Text style={styles.questionHeader}>The question was</Text>
                <Text style={{fontSize: 20, marginBottom: 10}}>{question.text}?</Text>
                <QuizImage
                    imageUri={question.imageUri}
                    saveType={passedQuiz.saveType}
                />
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.containerHeader}>{correct ? 'Correct!' : 'Incorrect'}</Text>
                <View>
                    <Text style={styles.smallHeader}>Your answer</Text>
                    <Text>{question.userAnswer !== '' ? formatAnswer(question.userAnswer) : 'You didn\'t answer this question'}</Text>
                </View>
                {!correct && (
                    <View style={{marginTop: 10}}>
                        <Text style={styles.smallHeader}>{question.type === 'Multiple Select' ? 'The correct answers were' : 'The correct answer was'}</Text>
                        <Text>{formatAnswer(question.correctAnswer)}</Text>
                    </View>
                )}
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.containerHeader}>Feedback</Text>
                <Text>{feedback}</Text>
            </View>


            <ImageModal
                visible={imagePreviewVisible}
                onClose={() => {setImagePreviewVisible(false)}}
                imageUri={question?.imageUri ? passedQuiz.saveType === "cloud"
                    ? `${process.env.EXPO_PUBLIC_API_BASE_URL ?? ""}uploads/${question.imageUri}`
                    : question.imageUri : ''
                }
            />
        </View>
    )
};

const styles = StyleSheet.create ({
    container:{
        flex: 1,
        padding: 10,
    },
    sectionContainer:{
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e0e0e0',
    },
    questionHeader: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    containerHeader:{
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    smallHeader: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        position: 'absolute',
        zIndex: 1,
    },
});