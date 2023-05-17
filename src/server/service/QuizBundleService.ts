import { Quiz } from '../../type/quiz';
import { QuizBundle } from '../../type/quizBundle';
import { quizBundleRepository } from '../repository/QuizBundleRepository';

class QuizBundleService {
  createQuizBundle(title: string, quizList: Quiz[]) {
    const quizBundle: QuizBundle = { title, quizList };
    quizBundleRepository.save(quizBundle);
    return quizBundle.id;
  }
}

export const quizBundleService = new QuizBundleService();
