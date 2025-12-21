import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

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
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        return this.execute(dropQuizTable);
    }
}
export default new DatabaseController();