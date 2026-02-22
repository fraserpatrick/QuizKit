import { db } from '@/localDatabase/databaseConnection';
import { Question } from '@/app/components/Interfaces';

export const createLocalQuestion = async (quizID: number, text: string, type: string, correctAnswer: string, options: string[], feedback: string): Promise<boolean> => {
    const insertSQL = `INSERT INTO question (quizID, text, type, correctAnswer, options, feedback) VALUES (?, ?, ?, ?, ?, ?)`;
    const data = [quizID, text, type, correctAnswer, JSON.stringify(options), feedback];
    await db.runAsync(insertSQL, data);

    return true;
}

export const getLocalQuestions = async (): Promise<Question[]> => {
    const sql = `SELECT * FROM question`;
    const result = db.getAllSync(sql);

    return result.map((question: any) => ({
        ...question,
        options: JSON.parse(question.options),
    })) as Question[];
}

export const getLocalQuizQuestions = async (quizID: number): Promise<Question[]> => {
    const sql = `SELECT * FROM question WHERE quizID = ?`;
    const result = db.getAllSync(sql, [quizID]);

    return result.map((question: any) => ({
        ...question,
        options: JSON.parse(question.options),
    })) as Question[];
}

export const updateLocalQuestion = async (questionID: number, text: string, type: string, correctAnswer: string, options: string[], feedback: string): Promise<boolean> => {
    const sql = `UPDATE question SET text = ?, type = ?, correctAnswer = ?, options = ?, feedback = ? WHERE id = ?`;
    const data = [text, type, correctAnswer, JSON.stringify(options), feedback, questionID];

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