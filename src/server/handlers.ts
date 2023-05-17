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
import { SocketPayload, SocketPayloadTypes } from '../type/socket';
import { ApiError } from '../error/api/ApiError';
import { gameService } from './service/GameService';
import { dangerConcat } from '../util';

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
    const id = Number(req.params.id);

    roomService.enter(id, memberId);

    const { users } = roomService.findRoom(id);

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

  rest.post('/api/game/start', (req, res, ctx) => {
    const memberId = getPrincipal();
    const member = memberRepository.findById(memberId);
    const roomId = member.roomId;

    try {
      const payloads = roomService.gameStart(roomId);
      return res(ctx.status(200), ctx.json({ socket: payloads }));
    } catch (e) {
      if (e instanceof ApiError) {
        const { message, code } = e;
        return res(ctx.status(e.httpStatus), ctx.json({ error: { message, code } }));
      }
    }
  }),

  rest.post('/api/socket', async (req, res, ctx) => {
    const memberId = getPrincipal();
    const member = memberRepository.findById(memberId);

    const payloads: SocketPayload[] = [];

    const payload: SocketPayload = await req.json();
    const { type, body } = payload;

    switch (type) {
      case SocketPayloadTypes.LOCAL_CHAT: {
        const room = roomRepository.findById(member.roomId);

        if (room && room.status === 'playing') {
          dangerConcat(payloads, gameService.compare(room, body, member));
          return res(ctx.status(200), ctx.json({ socket: payloads }));
        } else {
          payload.from = member.name;
          payloads.push(payload);
          return res(ctx.status(200), ctx.json({ socket: payloads }));
        }
      }
    }
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
