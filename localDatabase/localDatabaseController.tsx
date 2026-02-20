import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('QuizkitDatabase.db');


class localDatabaseController {
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

    public async databaseReset(): Promise<boolean> {
        await this.execute(`DROP TABLE IF EXISTS question;`);
        return this.execute(`DROP TABLE IF EXISTS quiz;`);
    }
}

export default new localDatabaseController();