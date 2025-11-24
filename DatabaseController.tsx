import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

export interface User {
    username: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
}

export interface Quiz {
    id?: number;
    name: string;
    userID: string;
}

class DatabaseController {
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS user (
                    username TEXT PRIMARY KEY UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    securityQuestion TEXT NOT NULL,
                    securityAnswer TEXT NOT NULL
                );
            `);
        } catch (error) {
            console.error('Database initialization error:', error);
        }
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS quiz (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    userID TEXT NOT NULL
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


    public async insertUser(username: string, password: string, securityQuestion: string, securityAnswer: string): Promise<boolean> {
        const sql = `INSERT INTO user (username, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?)`;
        return this.execute(sql, [username, password, securityQuestion, securityAnswer]);
    }

    public async getUsers(): Promise<User[]> {
        const sql = `SELECT * FROM user`;
        return this.select<User>(sql);
    }

    public async findUserByUsername(username: string): Promise<User | null> {
        const sql = `SELECT * FROM user WHERE username = ?`;
        const results = await this.select<User>(sql, [username]);
        if (results.length > 0) {
            return results[0];
        }
        return null;
    }

    public async resetUserPassword(username: string, password: string): Promise<boolean> {
        const sql = `UPDATE user SET password = ? WHERE USERNAME = ?`;
        return this.execute(sql, [password, username]);
    }


    public async createQuiz(name: string, userID: number): Promise<number> {
        const sql = `INSERT INTO quiz (name, userID) VALUES (?, ?)`;

        try {
            const result = await db.runAsync(sql, [name, userID]);

            const newId = (result as any).lastInsertRowId;
            if (!newId && newId !== 0) {
                throw new Error('Failed to get new quiz ID');
            }
            return newId;
        } catch (error) {
            console.error('createQuiz error:', error);
            throw error;
        }
    }

    public getQuizzes(): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz`;
        return this.select<Quiz>(sql);
    }


    public async databaseReset(): Promise<boolean>{
        const sql = `DROP TABLE IF EXISTS user;`;
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        await this.execute(dropQuizTable);
        return this.execute(sql) ;
    }
}
export default new DatabaseController();