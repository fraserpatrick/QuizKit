import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');

export interface Quiz {
    id?: number;
    name: string;
    userID: string;
    visibility: string;
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
                    visibility TEXT NOT NULL
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

    public async createQuiz(name: string, userID: number, visibility: string): Promise<Quiz> {
        const insertSQL = `INSERT INTO quiz (name, userID, visibility) VALUES (?, ?, ?)`;

        await this.execute(insertSQL, [name, userID, visibility]);

        const selectSQL = `SELECT id, name, userID, visibility FROM quiz WHERE id = last_insert_rowid()`;

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


    public async databaseReset(): Promise<boolean>{
        const dropQuizTable = `DROP TABLE IF EXISTS quiz;`;
        return this.execute(dropQuizTable);
    }
}
export default new DatabaseController();