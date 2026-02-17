import {apiFetch} from '@/api/apiConnection';


export const createUser = (email: string, username: string) => {
    return apiFetch("users", "POST", {email, username});
}


export const getUsers = async (params = {}) => {
    return apiFetch("users", "GET", null, params);
}

export const getUserByUsername = async (search: string) => {
    const result = await getUsers({username: search});
    return result[0] ?? [];
}

export const getUserByEmail = async (search: string) => {
    const result = await getUsers({email: search});
    return result[0] ?? null;
}


export const updateUsername = (email: string, newUsername: string) => {
    return apiFetch("users/updateUsername", "PUT", {email, newUsername});
}

export const updateStats = (username: string, answered: number, correct: number, points: number) => {
    return apiFetch("users/updateStats", "PUT", {username, answered, correct, points});
}