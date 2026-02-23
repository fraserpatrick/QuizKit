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
            let parsedOptions: string[] = [];
            try {
                parsedOptions = JSON.parse(question.options);
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }
            await createLocalQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback);
        }

        await deleteQuestions(oldQuizID);
        await deleteQuiz(oldQuizID);

    }
    else {
        questions = await getLocalQuizQuestions(oldQuizID);

        newQuiz = await createQuiz(title, username, visibility, description);

        for (const question of questions){
            let parsedOptions: string[] = [];
            try {
                parsedOptions = JSON.parse(question.options);
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }
            await createQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback);
        }

        await deleteLocalQuestions(oldQuizID);
        await deleteLocalQuiz(oldQuizID);

    }

    return newQuiz;
}