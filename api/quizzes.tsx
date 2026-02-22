import { apiFetch } from "@/api/apiConnection";

export const createQuiz = (title: string, owner: string, visibility: string, description: string) => {
    return apiFetch("quizzes", "POST", {title, owner, visibility, description});
}


export const getQuizzes = (params = {}) => {
    return apiFetch("quizzes", "GET", null, params); 
}

export const getOwnedQuizzes = (owner: string) => {
    return getQuizzes({owner});
}

export const getSharedQuizzes = (owner: string) => {
    return apiFetch("quizzes/shared", "GET", null, {owner}); 
}


export const updateQuiz = (id: number, title: string, visibility: string, description: string) => {
    return apiFetch("quizzes/update", "PUT", {id, title, visibility, description});
}

export const updateQuizToNewUsername = (oldUsername: string, newUsername: string) => {
    return apiFetch("quizzes/update/username", "PUT", {oldUsername, newUsername});
}


export const deleteQuiz = (id: number) => {
    return apiFetch("quizzes", "DELETE", null, {id});
}