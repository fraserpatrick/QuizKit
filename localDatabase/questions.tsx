import localDatabaseController from '@/localDatabase/localDatabaseController';
import { Question } from '@/app/components/Interfaces';

class questionTable {
    public createQuestion(quizID: number, type: string, text: string, correctAnswer: string, options: string[]): Promise<boolean> {
        const insertSQL = `INSERT INTO question (quizID, type, text, correctAnswer, options) VALUES (?, ?, ?, ?, ?)`;
        return localDatabaseController.execute(insertSQL, [quizID, type, text, correctAnswer, JSON.stringify(options)]);
    }

    public async getQuestions(): Promise<Question[]> {
        const sql = `SELECT * FROM question`;
        const rows = await localDatabaseController.select<any>(sql);

        return rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [],
        }));
    }

    public async getQuestionsByQuizID(quizID: number): Promise<Question[]> {
        const sql = `SELECT * FROM question WHERE quizID = ?`;
        const rows = await localDatabaseController.select<any>(sql, [quizID]);
        
        return rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [],
        }));
    }

    public updateQuestion(questionID: number, type: string, text: string, correctAnswer: string, options: string[]): Promise<boolean> {
        const sql = `UPDATE question SET type = ?, text = ?, correctAnswer = ?, options = ? WHERE id = ?`;
        return localDatabaseController.execute(sql, [type, text, correctAnswer, JSON.stringify(options), questionID]);
    }

    public deleteQuestion(questionID: number): Promise<boolean> {
        const sql = `DELETE FROM question WHERE id = ?`;
        return localDatabaseController.execute(sql, [questionID]);
    }
}

export default new questionTable();