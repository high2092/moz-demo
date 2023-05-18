import { Answer, Quiz, QuizType } from '../../type/quiz';
import { quizRepository } from '../repository/QuizRepository';

class QuizService {
  createQuiz(type: QuizType, question: string, answers: Answer[]) {
    answers.forEach((answer) => (answer.score = Number(answer.score)));
    const quiz: Quiz = { type, question, answers };
    quizRepository.save(quiz);
    return quiz.id;
  }

  updateQuiz(quiz: Quiz) {
    quizRepository.save(quiz);
  }

  deleteQuiz(id: number) {
    quizRepository.deleteById(id);
  }
}

export const quizService = new QuizService();
