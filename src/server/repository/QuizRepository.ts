import { Quiz } from '../../type/quiz';

class QuizRepository {
  sequence: number;
  quizzes: Record<number, Quiz>;

  constructor() {
    this.sequence = 1;
    this.quizzes = {};
  }

  save(quiz: Quiz) {
    if (quiz.id) {
      const { id } = quiz;
      this.quizzes[id] = quiz;
    } else {
      const id = this.sequence++;
      quiz.id = id;
      this.quizzes[id] = quiz;
    }
  }

  findAll() {
    return Object.values(this.quizzes);
  }

  findById(id: number) {
    return this.quizzes[id];
  }

  deleteById(id: number) {
    delete this.quizzes[id];
  }
}

export const quizRepository = new QuizRepository();
