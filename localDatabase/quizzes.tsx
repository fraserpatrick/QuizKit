import localDatabaseController from '@/localDatabase/localDatabaseController';
import { Quiz } from '@/app/components/Interfaces';

class quizTable {
    public async createQuiz(title: string, owner: string, visibility: string, description: string): Promise<Quiz> {
        const insertSQL = `INSERT INTO quiz (title, owner, visibility, description) VALUES (?, ?, ?, ?)`;

        await localDatabaseController.execute(insertSQL, [title, owner, visibility, description]);

        const selectSQL = `SELECT id, title, owner, visibility, description FROM quiz WHERE id = last_insert_rowid()`;
        const [quiz] = await localDatabaseController.select<Quiz>(selectSQL);
        if (!quiz) {
            throw new Error('Failed to retrieve the newly created quiz');
        }
        return quiz;
    }

    public getQuizzes(): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz`;
        return localDatabaseController.select<Quiz>(sql);
    }

    public getUsersQuizzes(owner: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE owner = ?`;
        return localDatabaseController.select<Quiz>(sql, [owner]);
    }

    public getSharedQuizzes(owner: string): Promise<Quiz[]> {
        const sql = `SELECT * FROM quiz WHERE visibility = 'Public' AND owner != ?`;
        return localDatabaseController.select<Quiz>(sql, [owner]);
    }

    public deleteQuiz(quizID: number): Promise<boolean> {
        const sql = `DELETE FROM quiz WHERE id = ?`;
        return localDatabaseController.execute(sql, [quizID]);
    }

    public async updateQuiz(quizID: number, title: string, visibility: string, description: string) : Promise<Quiz>{
        const updateSQL = `UPDATE quiz SET title = ?, visibility = ?, description = ? WHERE id = ?`;
        await localDatabaseController.execute(updateSQL, [title, visibility, description, quizID]);

        const selectSQL = `SELECT id, title, owner, visibility, description FROM quiz WHERE id = ?`;
        const [quiz] = await localDatabaseController.select<Quiz>(selectSQL, [quizID]);
        if (!quiz) {
            throw new Error('Failed to retrieve the newly created quiz');
        }
        return quiz;
    }
}

export default new quizTable();