import { apiFetch } from "@/api/apiConnection";


export const createQuestion = (quizID: number, text: string, type: string, correctAnswer: string, options: string[], feedback: string) => {
    return apiFetch("questions", "POST", {quizID, text, type, correctAnswer, options, feedback});
}


export const getQuestions = (params = {}) => {
    return apiFetch("questions", "GET", null, params);
}

export const getQuizQuestions = (quizID: number) => {
    return getQuestions({quizid: quizID});
}


export const updateQuestion = (questionID: number, text: string, type: string, correctAnswer: string, options: string[], feedback: string) => {
    return apiFetch("questions/update", "PUT", {questionID, text, type, correctAnswer, options, feedback});
}


export const deleteQuestion = (questionID: number) => {
    return apiFetch("questions", "DELETE", null, {questionID});
}

export const deleteQuestions = (quizID: number) => {
    return apiFetch("questions", "DELETE", null, {quizID})
}