import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

export interface Quiz {
    id?: number;
    title: string;
    owner: string;
    visibility: string;
    description: string;
}

export interface User {
    id?: number;
    email: string;
    username: string;
    totalQuizPlays?: number;
    totalAnswers?: number;
    totalCorrect?: number;
    points?: number;
}

export interface Question {
    id?: number;
    quizID: number;
    type: string;
    text: string;
    correctAnswer: string;
    options: string[];
    feedback: string;
    userAnswer?: string;
}

class DatabaseController {
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS quiz (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    owner TEXT NOT NULL,
                    visibility TEXT NOT NULL,
                    description TEXT
                );
            `);
        } catch (error) {
            console.error('Quiz table initialization error:', error);
        }
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS question (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    quizID INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    text TEXT NOT NULL,
                    correctAnswer TEXT NOT NULL,
                    options TEXT
                );
            `);
        } catch (error) {
            console.error('Question table initialization error:', error);
        }
    }

    public async select<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        try {
            const result = await db.getAllAsync(sql, params);
            return result as T[];
        } catch (error) {
            console.error('SELECT error:', error);
            throw error;
        }
    }

    public async execute(sql: string, params: any[] = []): Promise<boolean> {
        try {
            await db.runAsync(sql, params);
            return true;
        } catch (error) {
            console.error('EXECUTE error:', error);
            throw error;
        }
    }

    public async createQuiz(title: string, owner: string, visibility: string, description: string): Promise<Quiz> {
        const insertSQL = `INSERT INTO quiz (title, owner, visibility, description) VALUES (?, ?, ?, ?)`;

        await this.execute(insertSQL, [title, owner, visibility, description]);

        const selectSQL = `SELECT id, title, owner, visibility, description FROM quiz WHERE id = last_insert_rowid()`;
        const [quiz] = await this.select<Quiz>(selectSQL);
        if (!quiz) {
            throw new Error('Failed to retrieve the newly created quiz');
        }
        return quiz;
    }

    public getQuizzes(): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz`;
        return this.select<Quiz>(sql);
    }

    public getUsersQuizzes(owner: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE owner = ?`;
        return this.select<Quiz>(sql, [owner]);
    }

    public getSharedQuizzes(owner: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE visibility = 'Public' AND owner != ?`;
        return this.select<Quiz>(sql, [owner]);
    }

    public deleteQuiz(quizID: number): Promise<boolean> {
        const sql = `DELETE FROM quiz WHERE id = ?`;
        return this.execute(sql, [quizID]);
    }

    public async updateQuiz(quizID: number, title: string, visibility: string, description: string) : Promise<Quiz>{
        const updateSQL = `UPDATE quiz SET title = ?, visibility = ?, description = ? WHERE id = ?`;
        await this.execute(updateSQL, [title, visibility, description, quizID]);

        const selectSQL = `SELECT id, title, owner, visibility, description FROM quiz WHERE id = ?`;
        const [quiz] = await this.select<Quiz>(selectSQL, [quizID]);
        if (!quiz) {
            throw new Error('Failed to retrieve the newly created quiz');
        }
        return quiz;
    }



    public createQuestion(quizID: number, type: string, text: string, correctAnswer: string, options: string[]): Promise<boolean> {
        const insertSQL = `INSERT INTO question (quizID, type, text, correctAnswer, options) VALUES (?, ?, ?, ?, ?)`;
        return this.execute(insertSQL, [quizID, type, text, correctAnswer, JSON.stringify(options)]);
    }

    public async getQuestions(): Promise<Question[]> {
        const sql = `SELECT * FROM question`;
        const rows = await this.select<any>(sql);

        return rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [],
        }));
    }

    public async getQuestionsByQuizID(quizID: number): Promise<Question[]> {
        const sql = `SELECT * FROM question WHERE quizID = ?`;
        const rows = await this.select<any>(sql, [quizID]);
        
        return rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [],
        }));
    }

    public updateQuestion(questionID: number, type: string, text: string, correctAnswer: string, options: string[]): Promise<boolean> {
        const sql = `UPDATE question SET type = ?, text = ?, correctAnswer = ?, options = ? WHERE id = ?`;
        return this.execute(sql, [type, text, correctAnswer, JSON.stringify(options), questionID]);
    }

    public deleteQuestion(questionID: number): Promise<boolean> {
        const sql = `DELETE FROM question WHERE id = ?`;
        return this.execute(sql, [questionID]);
    }


    public async databaseReset(): Promise<boolean>{
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        const dropQuestionTable = `DROP TABLE IF EXISTS question;`;
        await this.execute(dropQuestionTable);
        return this.execute(dropQuizTable);
    }
}
export default new DatabaseController();