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
    totalQuestionsAnswered?: number;
    totalQuestionsCorrect?: number;
}

export interface Question {
    id?: number;
    quizID: number;
    type: string;
    text: string;
    correctAnswer: string;
    wrongAnswer1: string;
    wrongAnswer2: string;
    wrongAnswer3: string;
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
                CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    username TEXT NOT NULL,
                    totalQuizPlays INTEGER DEFAULT 0,
                    totalQuestionsAnswered INTEGER DEFAULT 0,
                    totalQuestionsCorrect INTEGER DEFAULT 0
                );
            `);
        } catch (error) {
            console.error('User table initialization error:', error);
        }
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS question (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    quizID INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    text TEXT NOT NULL,
                    correctAnswer TEXT NOT NULL,
                    wrongAnswer1 TEXT,
                    wrongAnswer2 TEXT,
                    wrongAnswer3 TEXT
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


    public createUser(email: string, username: string): Promise<boolean> {
        const insertSQL = `INSERT INTO user (email, username) VALUES (?, ?)`;
        return this.execute(insertSQL, [email, username])
    }

    public getUser(email: string): Promise<User[]> {
        const sql = `SELECT * FROM user WHERE email = ?`;
        return this.select<User>(sql, [email]);
    }

    public getUserByUsername(username: string): Promise<User[]> {
        const sql = `SELECT * FROM user WHERE username = ?`;
        return this.select<User>(sql, [username]);
    }

    public getUsers(): Promise<User[]> {
        const sql = `SELECT * FROM user`;
        return this.select<User>(sql);
    }

    public updateUsername(email: string, newUsername: string): Promise<boolean> {
        const sql = `UPDATE user SET username = ? WHERE email = ?`;
        return this.execute(sql, [newUsername, email]);
    }

    public updateQuizToNewUsername(oldUsername: string, newUsername: string): Promise<boolean> {
        const sql = `UPDATE quiz SET userID = ? WHERE userID = ?`;
        return this.execute(sql, [newUsername, oldUsername]);
    }

    public updateUserStats(username: string, plays: number, answered: number, correct: number): Promise<boolean> {
        const sql = `UPDATE user SET totalQuizPlays = ?, totalQuestionsAnswered = ?, totalQuestionsCorrect = ? WHERE username = ?`;
        return this.execute(sql, [plays, answered, correct, username]);
    }


    public createQuestion(quizID: number, type: string, text: string, correctAnswer: string, wrongAnswer1: string, wrongAnswer2: string, wrongAnswer3: string): Promise<boolean> {
        const insertSQL = `INSERT INTO question (quizID, type, text, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return this.execute(insertSQL, [quizID, type, text, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3]);
    }

    public getQuestions(): Promise<Question[]> {
        const sql = `SELECT * FROM question`;
        return this.select<Question>(sql);
    }

    public getQuestionsByQuizID(quizID: number): Promise<Question[]> {
        const sql = `SELECT * FROM question WHERE quizID = ?`;
        return this.select<Question>(sql, [quizID]);
    }

    public updateQuestion(questionID: number, type: string, text: string, correctAnswer: string, wrongAnswer1: string, wrongAnswer2: string, wrongAnswer3: string): Promise<boolean> {
        const sql = `UPDATE question SET type = ?, text = ?, correctAnswer = ?, wrongAnswer1 = ?, wrongAnswer2 = ?, wrongAnswer3 = ? WHERE id = ?`;
        return this.execute(sql, [type, text, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3, questionID]);
    }

    public deleteQuestion(questionID: number): Promise<boolean> {
        const sql = `DELETE FROM question WHERE id = ?`;
        return this.execute(sql, [questionID]);
    }


    public async databaseReset(): Promise<boolean>{
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        const dropUserTable = `DROP TABLE IF EXISTS user;`;
        const dropQuestionTable = `DROP TABLE IF EXISTS question;`;
        await this.execute(dropQuestionTable);
        await this.execute(dropUserTable);
        return this.execute(dropQuizTable);
    }
}
export default new DatabaseController();