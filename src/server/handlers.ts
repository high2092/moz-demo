import { rest } from 'msw';

export const handlers = [
  rest.get('/api/quiz', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ quizList: [] }));
  }),

  rest.post('/api/quiz', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: generateMockId() }));
  }),

  rest.delete('/api/quiz/:id', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get('/api/quiz-bundle', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ quizBundleList: [] }));
  }),

  rest.post('/api/quiz-bundle', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(generateMockId()));
  }),

  rest.get('/api/room', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ rooms: [] }));
  }),

  rest.post('/api/room', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(generateMockId()));
  }),

  rest.get('/api/room/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),

  rest.post('/api/game/ready', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post('/api/game/unready', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post('/api/game/add-quiz', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(generateMockId()));
  }),
];

function generateMockId() {
  return Math.floor(Math.random() * 20_000);
}
