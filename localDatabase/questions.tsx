import { db } from '@/localDatabase/databaseConnection';
import { Question } from '@/components/Interfaces';

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
    const sql = `SELECT * FROM question WHERE quizID = ? ORDER BY questionOrder`;
    const result = db.getAllSync(sql, [quizID]);

    return result as Question[];
}

export const updateLocalQuestion = async (questionID: number, text: string, type: string, correctAnswer: string, mcOptions: string[], feedback: string, imageUri: string): Promise<boolean> => {
    const sql = `UPDATE question SET text = ?, type = ?, correctAnswer = ?, mcOptions = ?, feedback = ?, imageUri = ? WHERE id = ?`;
    const data = [text, type, correctAnswer, JSON.stringify(mcOptions), feedback, imageUri, questionID];

    await db.runAsync(sql, data);

    return true;
}

export const updateLocalQuestionOrder = async (questions: Question[]): Promise<boolean> => {
    await db.runAsync("BEGIN TRANSACTION");
    const sql = `UPDATE question SET questionOrder = ? WHERE id = ?`;

    try {
        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];
            await db.runAsync(sql, [index, question.id!]);
        }

        await db.runAsync("COMMIT");
        return true;
    } catch (error) {
        await db.runAsync("ROLLBACK");
        console.error("Failed to update question order:", error);
        return false;
    }
};

export const deleteLocalQuestion = async (questionID: number): Promise<boolean> => {
    const sql = `DELETE FROM question WHERE id = ?`;
    await db.runAsync(sql, [questionID]);

    return true;
}