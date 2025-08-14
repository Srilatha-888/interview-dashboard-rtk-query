import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchQuestionsAPI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: '1', 
          title: 'What is React?', 
          answer: 'React is a JavaScript library for building user interfaces.',
          tags: 'React,Frontend,JavaScript', 
          difficulty: 'Easy' 
        },
        { 
          id: '2', 
          title: 'Explain Redux', 
          answer: 'Redux is a predictable state container for JavaScript apps.',
          tags: 'Redux,State Management', 
          difficulty: 'Medium' 
        },
        {
          id: '3',
          title: 'What is Virtual DOM?',
          answer: 'Virtual DOM is a lightweight copy of the actual DOM that allows React to update the UI efficiently.',
          tags: 'React,Performance',
          difficulty: 'Medium'
        },
      ]);
    }, 500);
  });
};

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async () => {
    const response = await fetchQuestionsAPI();
    return response;
  }
);

export const addNewQuestion = createAsyncThunk(
  'questions/addNewQuestion',
  async (question) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...question,
          id: Date.now().toString(),
        });
      }, 500);
    });
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async (question) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(question);
      }, 500);
    });
  }
);

export const removeQuestion = createAsyncThunk(
  'questions/removeQuestion',
  async (questionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(questionId);
      }, 500);
    });
  }
);

const initialState = {
  questions: [],
  status: 'idle', 
  error: null,
  searchTerm: ''
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      .addCase(addNewQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload);
      })
      
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
    
      .addCase(removeQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q.id !== action.payload);
      });
  }
});

export const { setSearchTerm, clearQuestions } = questionsSlice.actions;

export const selectAllQuestions = state => state.questions.questions;
export const getQuestionsStatus = state => state.questions.status;
export const getQuestionsError = state => state.questions.error;
export const getSearchTerm = state => state.questions.searchTerm;

export const selectFilteredQuestions = (state) => {
  const searchTerm = getSearchTerm(state).toLowerCase();
  return state.questions.questions.filter(question => 
    question.title.toLowerCase().includes(searchTerm) ||
    question.tags.toLowerCase().includes(searchTerm)
  );
};

export default questionsSlice.reducer;
