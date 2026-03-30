import { createQuestion, getQuizQuestions, uploadImage } from "@/api/questions";
import { createQuiz, deleteQuiz } from "@/api/quizzes";
import { createLocalQuestion, getLocalQuizQuestions } from "@/localDatabase/questions";
import { createLocalQuiz, deleteLocalQuiz } from "@/localDatabase/quizzes";

export async function quizMigration(oldQuizID: number, username: string, title: string, visibility: string, description: string, saveType: string) {
    let questions;
    let newQuiz;

    if (saveType === 'local'){
        questions = await getQuizQuestions(oldQuizID);  //loads the old questions

        newQuiz = await createLocalQuiz(title, username, visibility, description);  //creates the new local quiz

        for (const question of questions){          //loops through each question in the old quiz
            let parsedOptions: string[] = [];
            try {
                parsedOptions = JSON.parse(question.mcOptions);     
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }


            await createLocalQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback, ""); //creates the question on the local database
        }

        await deleteQuiz(oldQuizID);    //deletes the old cloud quiz

    }
    else {
        questions = await getLocalQuizQuestions(oldQuizID); //loads the old questions

        newQuiz = await createQuiz(title, username, visibility, description);   //creates the new cloud quiz

        for (const question of questions){  //loops through each question
            let parsedOptions: string[] = [];
            try {
                parsedOptions = JSON.parse(question.mcOptions);
            } catch (error) {
                console.error('Error parsing options for question ID ' + question.id + ':', error);
            }

            let finalImageUri = question.imageUri ?? '';
            if (finalImageUri.startsWith('file://')) {
                finalImageUri = await uploadImage(finalImageUri);   //uploads image if question contains one
            }
            
            await createQuestion(newQuiz.id!, question.text, question.type, question.correctAnswer, parsedOptions, question.feedback, finalImageUri);   //creates the new question on the cloud database
        }

        await deleteLocalQuiz(oldQuizID);   //deletes the old local quiz

    }

    return newQuiz;
}