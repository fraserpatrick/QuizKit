import { apiFetch } from "@/api/apiConnection";
import { Question } from "@/components/Interfaces";


export const createQuestion = (quizID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string) => {
    return apiFetch("questions", "POST", {quizID, text, type, correctAnswer, mcOptions, feedback, imageUri});
}


export const getQuestions = (params = {}) => {
    return apiFetch("questions", "GET", null, params);
}

export const getQuizQuestions = (quizid: number) => {
    return getQuestions({quizid});
}


export const updateQuestion = (questionID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string) => {
    return apiFetch("questions/update", "PUT", {questionID, text, type, correctAnswer, mcOptions, feedback, imageUri});
}

export const updateQuestionOrder = (questions: Question[]) => {
    const questionOrder = questions.map((question, index) => ({
        id: question.id,
        order: index
    }));
    return apiFetch("questions/updateOrder", "PUT", {questionOrder});
}


export const deleteQuestion = (questionID: number) => {
    return apiFetch("questions", "DELETE", null, {questionID});
}


export const uploadImage = async (localUri: string) => {
    const data = new FormData();

    data.append("image", {
        uri: localUri,
        name: "image.jpg",
        type: "image/jpeg"
    } as any);

    const result = await apiFetch("questions/uploadFile", "POST", data, {}, true);

    return result.url;
}