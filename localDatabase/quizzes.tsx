import { db } from '@/localDatabase/databaseConnection';
import { Quiz } from '@/components/Interfaces';

export const createLocalQuiz = async (title: string, owner: string, visibility: string, description: string): Promise<Quiz> =>{
    const insertSQL = `INSERT INTO quiz (title, owner, visibility, description, saveType) VALUES (?, ?, ?, ?, 'local')`;
    const data = [title, owner, visibility, description];
    
    await db.runAsync(insertSQL, data);

    const selectSQL = `SELECT * FROM quiz WHERE id = last_insert_rowid()`;
    const result = db.getAllSync(selectSQL);

    return result[0] as Quiz;
}


export const getLocalQuizzes = async () : Promise<Quiz[]> => {
    const sql = `SELECT * FROM quiz ORDER BY title`;
    const result = db.getAllSync(sql);

    return result as Quiz[];
}

export const getLocalUsersQuizzes = async (owner: string) : Promise<Quiz[]> => {
    const sql = `SELECT * FROM quiz WHERE owner = ? ORDER BY title`;
    const result = db.getAllSync(sql, [owner])

    return result as Quiz[];
}


export const updateLocalQuiz = async (quizID: number, title: string, visibility: string, description: string) : Promise<Quiz> => {
    const sql = `UPDATE quiz SET title = ?, visibility = ?, description = ? WHERE id = ?`;
    const data = [title, visibility, description, quizID];

    await db.runAsync(sql, data);

    const selectSQL = `SELECT * FROM quiz WHERE id = ?`;
    const result = db.getAllSync(selectSQL, [quizID]);

    return result[0] as Quiz;
}

export const updateLocalQuizToNewUsername = async (oldUsername: string, newUsername: string) : Promise<boolean> => {
    const sql = `UPDATE quiz SET owner = ? WHERE owner = ?`;
    const data = [newUsername, oldUsername];

    await db.runAsync(sql, data);

    return true;
}


export const deleteLocalQuiz = async (quizID: number) : Promise<boolean> => {
    const sql = `DELETE FROM quiz WHERE id = ?`;
    await db.runAsync(sql, [quizID]);

    return true;
}

export const deleteLocalQuizWithOwner = async (username: string) : Promise<boolean> => {
    const sql = `DELETE FROM quiz WHERE owner = ?`;
    await db.runAsync(sql, [username]);

    return true;
}