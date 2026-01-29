import {apiFetch} from '@/api/apiConnection';


export const createUser = (email: string, username: string) => {
    apiFetch("users", "POST", {email, username});
}


export const getUsers = (params = {}) => {
    apiFetch("users", "GET", null, params);
}

export const getUser = (search: string) => {
    getUsers(search);
}


export const updateUsername = (email: string, newUsername: string) => {
    apiFetch("users/updateUsername", "PUT", {email, newUsername});
}

export const updateStats = (username: string, answered: number, correct: number) => {
    apiFetch("users/updateStats", "PUT", {username, answered, correct});
}