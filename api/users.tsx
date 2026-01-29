import {apiFetch} from '@/api/apiConnection';


export const createUser = (email: string, username: string) => {
    return apiFetch("users", "POST", {email, username});
}


export const getUsers = (params = {}) => {
    return apiFetch("users", "GET", null, params);
}

export const getUser = (search: string) => {
    return getUsers(search);
}


export const updateUsername = (email: string, newUsername: string) => {
    return apiFetch("users/updateUsername", "PUT", {email, newUsername});
}

export const updateStats = (username: string, answered: number, correct: number) => {
    return apiFetch("users/updateStats", "PUT", {username, answered, correct});
}