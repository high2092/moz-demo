import { rest } from 'msw';
import { roomRepository } from './repository/RoomRepository';
import { roomService } from './service/RoomService';
import { quizRepository } from './repository/QuizRepository';
import { quizService } from './service/QuizService';
import { quizBundleService } from './service/QuizBundleService';
import { quizBundleRepository } from './repository/QuizBundleRepository';
import { User } from '../type/user';
import { memberRepository } from './repository/MemberRepository';
import { memberService } from './service/MemberService';

export const handlers = [
  rest.get('/api/quiz', (req, res, ctx) => {
    const quizList = quizRepository.findAll();
    return res(ctx.status(200), ctx.json({ quizList }));
  }),

  rest.post('/api/quiz', async (req, res, ctx) => {
    const { type, question, answers } = await req.json();
    const id = quizService.createQuiz(type, question, answers);
    return res(ctx.status(200), ctx.json({ id }));
  }),

  rest.delete('/api/quiz/:id', (req, res, ctx) => {
    const id = Number(req.params.id);
    quizService.deleteQuiz(id);
    return res(ctx.status(200));
  }),

  rest.get('/api/quiz-bundle', (req, res, ctx) => {
    const quizBundleList = quizBundleRepository.findAll();
    return res(ctx.status(200), ctx.json({ quizBundleList }));
  }),

  rest.post('/api/quiz-bundle', async (req, res, ctx) => {
    const { title, quizzes } = await req.json();
    const id = quizBundleService.createQuizBundle(title, quizzes);
    return res(ctx.status(200), ctx.json(id));
  }),

  rest.get('/api/room', (req, res, ctx) => {
    const rooms = roomRepository.findAll();
    return res(ctx.status(200), ctx.json({ rooms }));
  }),

  rest.post('/api/room', async (req, res, ctx) => {
    const { name, capacity } = await req.json();
    const id = roomService.createRoom(name, capacity);
    return res(ctx.status(200), ctx.json(id));
  }),

  rest.get('/api/room/:id', (req, res, ctx) => {
    const memberId = getPrincipal();
    const member = memberRepository.findById(memberId);

    const id = Number(req.params.id);
    const { users } = roomService.findRoom(id);

    member.isReady = false;
    member.roomId = id;

    return res(ctx.status(200), ctx.json(users));
  }),

  rest.post('/api/game/ready', (req, res, ctx) => {
    const memberId = getPrincipal();
    const member = memberRepository.findById(memberId);

    const room = roomRepository.findById(member.roomId);
    if (room.status === 'playing') {
      return res(ctx.status(409));
    }

    memberService.toggleReady(memberId);

    return res(ctx.status(200), ctx.json({ ready: member.isReady }));
  }),

  rest.post('/api/game/add-quiz', async (req, res, ctx) => {
    const memberId = getPrincipal();
    const member = memberRepository.findById(memberId);
    const roomId = member.roomId;

    const { quizList } = await req.json();
    roomService.addQuizzes(roomId, quizList);

    return res(ctx.status(200));
  }),
];

function getPrincipal() {
  return 1;
}

function init() {
  const member: User = { name: 'guest' };
  memberRepository.save(member);
}

init();
