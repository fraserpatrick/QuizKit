import { apiFetch } from "@/api/apiConnection";


export const createQuestion = (quizID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string) => {
    return apiFetch("questions", "POST", {quizID, text, type, correctAnswer, mcOptions, feedback, imageUri});
}


export const getQuestions = (params = {}) => {
    return apiFetch("questions", "GET", null, params);
}

export const getQuizQuestions = (quizID: number) => {
    return getQuestions({quizid: quizID});
}


export const updateQuestion = (questionID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string) => {
    return apiFetch("questions/update", "PUT", {questionID, text, type, correctAnswer, mcOptions, feedback, imageUri});
}


export const deleteQuestion = (questionID: number) => {
    return apiFetch("questions", "DELETE", null, {questionID});
}

export const deleteQuestions = (quizID: number) => {
    return apiFetch("questions", "DELETE", null, {quizID})
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