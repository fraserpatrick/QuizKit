import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

export interface Quiz {
    id?: number;
    name: string;
    userID: string;
    visibility: string;
    description: string;
}

export interface User {
    id?: number;
    email: string;
    username: string;
    totalQuizPlays?: number;
    totalQuestionsAnswered?: number;
    TotalQuestionsCorrect?: number;
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
                    name TEXT NOT NULL,
                    userID TEXT NOT NULL,
                    visibility TEXT NOT NULL,
                    description TEXT
                );
            `);
        } catch (error) {
            console.error('Database initialization error:', error);
        }
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    username TEXT NOT NULL,
                    totalQuizPlays INTEGER DEFAULT 0,
                    totalQuestionsAnswered INTEGER DEFAULT 0,
                    TotalQuestionsCorrect INTEGER DEFAULT 0
                );
            `);
        } catch (error) {
            console.error('Database initialization error:', error);
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

    public async createQuiz(name: string, userID: string, visibility: string, description: string): Promise<Quiz> {
        const insertSQL = `INSERT INTO quiz (name, userID, visibility, description) VALUES (?, ?, ?, ?)`;

        await this.execute(insertSQL, [name, userID, visibility, description]);

        const selectSQL = `SELECT id, name, userID, visibility, description FROM quiz WHERE id = last_insert_rowid()`;

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

    public getUsersQuizzes(username: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE userID = ?`;
        return this.select<Quiz>(sql, [username]);
    }
    
    public getSharedQuizzes(username: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE visibility = 'Public' AND userID != ?`;
        return this.select<Quiz>(sql, [username]);
    }

    public deleteQuiz(quizID: number): Promise<boolean> {
        const sql = `DELETE FROM quiz WHERE id = ?`;
        return this.execute(sql, [quizID]);
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


    public async databaseReset(): Promise<boolean>{
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        const dropUserTable = `DROP TABLE IF EXISTS user;`;
        await this.execute(dropUserTable);
        return this.execute(dropQuizTable);
    }
}
export default new DatabaseController();