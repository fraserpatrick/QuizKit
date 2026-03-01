import { createQuestion, deleteQuestions, getQuizQuestions, uploadImage } from "@/api/questions";
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
                parsedOptions = JSON.parse(question.mcOptions);
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }


            await createLocalQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback, question.imageUri); //TODO: FIX THIS
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
                parsedOptions = JSON.parse(question.mcOptions);
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }

            let finalImageUri = question.imageUri ?? '';
            if (finalImageUri.startsWith('file://')) {
                finalImageUri = await uploadImage(finalImageUri);
            }
            
            await createQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback, finalImageUri);
        }

        await deleteLocalQuestions(oldQuizID);
        await deleteLocalQuiz(oldQuizID);

    }

    return newQuiz;
}