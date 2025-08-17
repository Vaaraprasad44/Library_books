import { moviesApi } from "../generated/todos";

export const todosApi = moviesApi.enhanceEndpoints({
    addTagTypes: [
        'TODO', 
    ],
    endpoints: {
        getTodos: {
            providesTags: ['TODO'],
        },
        createTodo: {
            invalidatesTags: ['TODO'],
        },
        updateTodo: {
            invalidatesTags: ['TODO'],
        },
        deleteTodo: {
            invalidatesTags: ['TODO'],
        },
    }
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;