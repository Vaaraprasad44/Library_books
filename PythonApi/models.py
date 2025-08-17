from pydantic import BaseModel
from typing import Optional


class Book(BaseModel):
    id: int
    title: str
    author: str
    isbn: Optional[str] = None
    publication_year: Optional[int] = None
    publisher: Optional[str] = None
    genre: Optional[str] = None
    pages: Optional[int] = None
    rating: Optional[float] = None
    description: Optional[str] = None


class CreateBookCommand(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    publication_year: Optional[int] = None
    publisher: Optional[str] = None
    genre: Optional[str] = None
    pages: Optional[int] = None
    rating: Optional[float] = None
    description: Optional[str] = None


class UpdateBookCommand(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    publication_year: Optional[int] = None
    publisher: Optional[str] = None
    genre: Optional[str] = None
    pages: Optional[int] = None
    rating: Optional[float] = None
    description: Optional[str] = None