import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync("QuizkitDatabase.db");

export const initializeDatabase = async () => {
    try {
        await db.execAsync(`PRAGMA foreign_keys = ON;`);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS quiz (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                owner TEXT NOT NULL,
                visibility TEXT NOT NULL,
                description TEXT,
                saveType TEXT NOT NULL
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS question (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quizID INTEGER NOT NULL,
                type TEXT NOT NULL,
                text TEXT NOT NULL,
                correctAnswer TEXT NOT NULL,
                mcOptions TEXT,
                feedback TEXT,
                imageUri TEXT,
                FOREIGN KEY (quizID)
                    REFERENCES quiz(id)
                    ON DELETE CASCADE
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