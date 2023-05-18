import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketPayload, SocketPayloadTypes } from '../type/socket';
import { Quiz, QuizTypes } from '../type/quiz';
import { QuizBundle } from '../type/quizBundle';
import { Room, RoomDto, RoomProfile } from '../type/Room';
import { User } from '../type/user';

interface MozState {
  socket: WebSocket;
  chatList: SocketPayload[];
  isReady: boolean;
  quizzes: Record<number, Quiz>;
  currentRoundQuiz: Quiz;
  quizBundles: Record<number, QuizBundle>;

  selectedQuizBundle: QuizBundle;
  editingQuiz: Quiz;

  isQuizBundleModal: boolean;

  hoveredQuizId: number;

  myProfile: User;
  roomInfo: RoomDto;

  roomList: RoomProfile[];

  initialized: boolean;
}

const initialState: MozState = {
  socket: null,
  chatList: [],
  isReady: false,
  quizzes: {},
  currentRoundQuiz: null,
  quizBundles: {},

  selectedQuizBundle: null,
  editingQuiz: null,

  isQuizBundleModal: true,

  hoveredQuizId: null,

  myProfile: null,
  roomInfo: null,

  roomList: [],

  initialized: false,
};

export const mozSlice = createSlice({
  name: 'moz',
  initialState,
  reducers: {
    initSocket(state, action: PayloadAction<WebSocket>) {
      if (state.socket !== null) return;
      state.socket = action.payload;
    },

    receiveMessage(state, action: PayloadAction<SocketPayload[]>) {
      const payloads = action.payload;
      for (const payload of payloads) {
        switch (payload.type) {
          case SocketPayloadTypes.SYSTEM:
          case SocketPayloadTypes.LOCAL_CHAT: {
            state.chatList = [...state.chatList, payload];
            break;
          }
          case SocketPayloadTypes.MUSIC_QUIZ: {
            state.currentRoundQuiz = { type: QuizTypes.MUSIC, question: payload.body };
            break;
          }
          case SocketPayloadTypes.ROUND_INFO: {
            state.currentRoundQuiz = { type: QuizTypes.CONSONANT, question: payload.body };
            break;
          }
          case SocketPayloadTypes.GAME_OVER: {
            state.isReady = false;
            state.chatList = [...state.chatList, payload];
            state.currentRoundQuiz = null;
            break;
          }
          case SocketPayloadTypes.ROOM_INFO: {
            state.roomInfo = JSON.parse(payload.body);
            break;
          }
        }
      }
    },

    setIsReady(state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },

    fetchQuiz(state, action: PayloadAction<Quiz[]>) {
      action.payload.forEach((quiz) => {
        state.quizzes[quiz.id] = quiz;
      });
    },

    addQuiz(state, action: PayloadAction<Quiz>) {
      const quiz = action.payload;
      state.quizzes[quiz.id] = quiz;
    },

    removeQuiz(state, action: PayloadAction<number>) {
      delete state.quizzes[action.payload];
    },

    addQuizBundle(state, action: PayloadAction<QuizBundle>) {
      const quizBundle = action.payload;
      state.quizBundles[quizBundle.id] = quizBundle;
    },

    toggleSelectQuiz(state, action: PayloadAction<number>) {
      const target = state.quizzes[action.payload];
      target.selected = !target.selected;
    },

    selectAll(state) {
      Object.values(state.quizzes).forEach((quiz) => (quiz.selected = true));
    },

    fetchQuizBundleList(state, action: PayloadAction<QuizBundle[]>) {
      action.payload.forEach((quizBundle) => {
        state.quizBundles[quizBundle.id] = quizBundle;
      });
    },

    selectQuizBundle(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.selectedQuizBundle?.id === id) {
        state.selectedQuizBundle = null;
      } else {
        state.selectedQuizBundle = state.quizBundles[id];
      }
    },

    editQuiz(state, action: PayloadAction<Quiz>) {
      state.editingQuiz = action.payload;
    },

    setIsQuizBundleModal(state, action: PayloadAction<boolean>) {
      state.isQuizBundleModal = action.payload;
    },

    setHoveredQuiz(state, action: PayloadAction<number>) {
      state.hoveredQuizId = action.payload;
    },

    fetchProfile(state, action: PayloadAction<User>) {
      console.log(action.payload);
      state.myProfile = action.payload;
    },

    fetchRoomList(state, action: PayloadAction<RoomProfile[]>) {
      state.roomList = action.payload;
    },

    addRoom(state, action: PayloadAction<RoomProfile>) {
      state.roomList.push(action.payload);
    },

    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
  },
});

export const {
  initSocket,
  receiveMessage,
  setIsReady,
  fetchQuiz,
  addQuiz,
  removeQuiz,
  addQuizBundle,
  toggleSelectQuiz,
  selectAll,
  fetchQuizBundleList,
  selectQuizBundle,
  editQuiz,
  setIsQuizBundleModal,
  setHoveredQuiz,
  fetchProfile,
  fetchRoomList,
  addRoom,
  setInitialized,
} = mozSlice.actions;
