import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

export interface User {
    id?: number;
    username: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
}

class DatabaseController {
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    securityQuestion TEXT NOT NULL,
                    securityAnswer TEXT NOT NULL
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

    public async databaseReset(): Promise<boolean>{
        const sql = `DROP TABLE IF EXISTS user;`;
        return this.execute(sql);
    }
}
export default new DatabaseController();