import { createQuestion, deleteQuestions, getQuizQuestions } from "@/api/questions";
import { createQuiz, deleteQuiz } from "@/api/quizzes";
import { createLocalQuestion, deleteLocalQuestions, getLocalQuizQuestions } from "@/localDatabase/questions";
import { createLocalQuiz, deleteLocalQuiz } from "@/localDatabase/quizzes";

export async function quizMigration(oldQuizID: number, username: string, title: string, visibility: string, description: string, saveType: string) {
    let questions;
    let newQuiz;

    if (saveType === 'local'){
        questions = await getQuizQuestions(oldQuizID);

        newQuiz = await createLocalQuiz(title, username, visibility, description);

        for (const question of questions){
            await createLocalQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, question.options, question.feedback);
        }

        await deleteQuestions(oldQuizID);
        await deleteQuiz(oldQuizID);

    }
    else {
        questions = await getLocalQuizQuestions(oldQuizID);

        newQuiz = await createQuiz(title, username, visibility, description);

        for (const question of questions){
            await createQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, question.options, question.feedback);
        }

        await deleteLocalQuestions(oldQuizID);
        await deleteLocalQuiz(oldQuizID);

    }

    return newQuiz;
}