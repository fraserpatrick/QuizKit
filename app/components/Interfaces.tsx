export interface Quiz {
    id?: number;
    title: string;
    owner: string;
    visibility: string;
    description: string;
}

export interface User {
    id?: number;
    email: string;
    username: string;
    totalQuizPlays?: number;
    totalAnswers?: number;
    totalCorrect?: number;
    points?: number;
}

export interface Question {
    id?: number;
    quizID: number;
    type: string;
    text: string;
    correctAnswer: string;
    options: string[];
    feedback: string;
    userAnswer?: string;
}