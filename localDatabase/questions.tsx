import { db } from '@/localDatabase/databaseConnection';
import { Question } from '@/app/components/Interfaces';

export const createLocalQuestion = async (quizID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string): Promise<boolean> => {
    const insertSQL = `INSERT INTO question (quizID, text, type, correctAnswer, mcOptions, feedback, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const data = [quizID, text, type, correctAnswer, JSON.stringify(mcOptions), feedback, imageUri];
    await db.runAsync(insertSQL, data);

    return true;
}

export const getLocalQuestions = async (): Promise<Question[]> => {
    const sql = `SELECT * FROM question`;
    const result = db.getAllSync(sql);

    return result as Question[];
}

export const getLocalQuizQuestions = async (quizID: number): Promise<Question[]> => {
    const sql = `SELECT * FROM question WHERE quizID = ?`;
    const result = db.getAllSync(sql, [quizID]);

    return result as Question[];
}

export const updateLocalQuestion = async (questionID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string): Promise<boolean> => {
    const sql = `UPDATE question SET text = ?, type = ?, correctAnswer = ?, mcOptions = ?, feedback = ?, imageUri = ? WHERE id = ?`;
    const data = [text, type, correctAnswer, JSON.stringify(mcOptions), feedback, imageUri, questionID];

    await db.runAsync(sql, data);

    return true;
}

export const deleteLocalQuestion = async (questionID: number): Promise<boolean> => {
    const sql = `DELETE FROM question WHERE id = ?`;
    await db.runAsync(sql, [questionID]);

    return true;
}

export const deleteLocalQuestions = async (quizID: number): Promise<boolean> => {
    const sql = `DELETE FROM question WHERE quizID = ?`;
    await db.runAsync(sql, [quizID]);

    return true;
}