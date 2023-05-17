import { QuizBundle } from '../../type/quizBundle';

class QuizBundleRepository {
  sequence: number;
  quizBundles: Record<number, QuizBundle>;

  constructor() {
    this.sequence = 1;
    this.quizBundles = {};
  }

  save(quizBundle: QuizBundle) {
    const id = this.sequence++;
    quizBundle.id = id;
    this.quizBundles[id] = quizBundle;
  }

  findAll() {
    return Object.values(this.quizBundles);
  }
}

export const quizBundleRepository = new QuizBundleRepository();
