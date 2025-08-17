import { booksApi } from "../generated/books";

export const enhancedBooksApi = booksApi.enhanceEndpoints({
    addTagTypes: [
        'BOOK', 
    ],
    endpoints: {
        getBooks: {
            providesTags: ['BOOK'],
        },
        createBook: {
            invalidatesTags: ['BOOK'],
        },
        searchBooks: {
            providesTags: ['BOOK'],
        },
        getBookById: {
            providesTags: (result, error, arg) => [
                { type: 'BOOK', id: arg.id }
            ],
        },
        updateBook: {
            invalidatesTags: (result, error, arg) => [
                { type: 'BOOK', id: arg.id },
                'BOOK'
            ],
        },
        deleteBook: {
            invalidatesTags: (result, error, arg) => [
                { type: 'BOOK', id: arg.id },
                'BOOK'
            ],
        },
    }
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useSearchBooksQuery,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = enhancedBooksApi;