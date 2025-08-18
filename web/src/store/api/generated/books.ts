/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
/* eslint-disable -- Auto Generated File */
import { emptySplitApi as api } from "../empty-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<GetBooksApiResponse, GetBooksApiArg>({
      query: () => ({ url: `/api/Books` }),
    }),
    createBook: build.mutation<CreateBookApiResponse, CreateBookApiArg>({
      query: (queryArg) => ({
        url: `/api/Books`,
        method: "POST",
        body: queryArg.createBookCommand,
      }),
    }),
    searchBooks: build.query<SearchBooksApiResponse, SearchBooksApiArg>({
      query: (queryArg) => ({
        url: `/api/Books/search`,
        params: {
          title: queryArg.title,
          author: queryArg.author,
        },
      }),
    }),
    getBookById: build.query<GetBookByIdApiResponse, GetBookByIdApiArg>({
      query: (queryArg) => ({ url: `/api/Books/${queryArg.id}` }),
    }),
    updateBook: build.mutation<UpdateBookApiResponse, UpdateBookApiArg>({
      query: (queryArg) => ({
        url: `/api/Books/${queryArg.id}`,
        method: "PUT",
        body: queryArg.updateBookCommand,
      }),
    }),
    deleteBook: build.mutation<DeleteBookApiResponse, DeleteBookApiArg>({
      query: (queryArg) => ({
        url: `/api/Books/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as booksApi };
export type GetBooksApiResponse =
  /** status 200 Successful Response */ Book[];
export type GetBooksApiArg = void;
export type CreateBookApiResponse =
  /** status 200 Successful Response */ number;
export type CreateBookApiArg = {
  createBookCommand: CreateBookCommand;
};
export type SearchBooksApiResponse =
  /** status 200 Successful Response */ Book[];
export type SearchBooksApiArg = {
  title?: string | null;
  author?: string | null;
};
export type GetBookByIdApiResponse =
  /** status 200 Successful Response */ Book;
export type GetBookByIdApiArg = {
  id: number;
};
export type UpdateBookApiResponse = /** status 200 Successful Response */ any;
export type UpdateBookApiArg = {
  id: number;
  updateBookCommand: UpdateBookCommand;
};
export type DeleteBookApiResponse = /** status 200 Successful Response */ any;
export type DeleteBookApiArg = {
  id: number;
};
export type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string | null;
  publication_year?: number | null;
  publisher?: string | null;
  genre?: string | null;
  pages?: number | null;
  rating?: number | null;
  description?: string | null;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type CreateBookCommand = {
  title: string;
  author: string;
  isbn?: string | null;
  publication_year?: number | null;
  publisher?: string | null;
  genre?: string | null;
  pages?: number | null;
  rating?: number | null;
  description?: string | null;
};
export type UpdateBookCommand = {
  title: string;
  author: string;
  isbn?: string | null;
  publication_year?: number | null;
  publisher?: string | null;
  genre?: string | null;
  pages?: number | null;
  rating?: number | null;
  description?: string | null;
};
export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useSearchBooksQuery,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = injectedRtkApi;