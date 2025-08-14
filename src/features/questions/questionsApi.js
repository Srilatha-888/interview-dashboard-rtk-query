import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

// In-memory data store to simulate a backend
let questionsData = [
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
  }
];

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Questions'],
  endpoints: (builder) => ({
    getQuestions: builder.query({
      providesTags: (result) =>
        result
          ? [
              ...result.map((q) => ({ type: 'Questions', id: q.id })),
              { type: 'Questions', id: 'LIST' }
            ]
          : [{ type: 'Questions', id: 'LIST' }],
      queryFn: async () => {
        return { data: questionsData.slice() };
      }
    }),
    addQuestion: builder.mutation({
      invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
      queryFn: async (question) => {
        const newQuestion = {
          ...question,
          id: Date.now().toString()
        };
        questionsData = [newQuestion, ...questionsData];
        return { data: newQuestion };
      }
    }),
    updateQuestion: builder.mutation({
      invalidatesTags: (result, error, arg) => [{ type: 'Questions', id: arg.id }],
      queryFn: async (updated) => {
        const index = questionsData.findIndex((q) => q.id === updated.id);
        if (index === -1) {
          return { error: { status: 404, data: 'Question not found' } };
        }
        questionsData[index] = { ...questionsData[index], ...updated };
        return { data: questionsData[index] };
      }
    }),
    deleteQuestion: builder.mutation({
      invalidatesTags: (result, error, id) => [
        { type: 'Questions', id },
        { type: 'Questions', id: 'LIST' }
      ],
      queryFn: async (id) => {
        questionsData = questionsData.filter((q) => q.id !== id);
        return { data: id };
      }
    })
  })
});

export const {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = questionsApi;


