import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync("QuizkitDatabase.db");

export const initializeDatabase = async () => {
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

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

export const resetDatabase = async () => {
    try {
        await db.execAsync(`DROP TABLE IF EXISTS question;`);

        await db.execAsync(`DROP TABLE IF EXISTS quiz;`);

        console.log('Database reset complete');

        await initializeDatabase();

        return true;
    } catch (error) {
        console.error('Database reset error:', error);
        return false;
    }
};