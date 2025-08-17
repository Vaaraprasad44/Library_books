from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, RedirectResponse
from typing import List, Optional
from models import Book, CreateBookCommand, UpdateBookCommand
from database import db

app = FastAPI(title="Library API", version="v1", docs_url="/swagger", redoc_url="/redoc")
app.title = "Library API"
app.version = "v1"
app.description = "Library Management API for Books and Todos"

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Send interactive user to swagger page by default
@app.get("/")
async def redirect_to_swagger():
    return RedirectResponse(url="/swagger")


# Book endpoints
@app.get("/api/Books", response_model=List[Book], tags=["Books"], operation_id="GetBooks")
async def get_books():
    return db.get_all_books()


@app.get("/api/Books/search", response_model=List[Book], tags=["Books"], operation_id="SearchBooks")
async def search_books(
    title: Optional[str] = Query(None, description="Search by book title"),
    author: Optional[str] = Query(None, description="Search by author name")
):
    if title:
        return db.search_books_by_title(title)
    elif author:
        return db.search_books_by_author(author)
    else:
        return db.get_all_books()


@app.get("/api/Books/{id}", response_model=Book, tags=["Books"], operation_id="GetBookById")
async def get_book_by_id(id: int):
    book = db.get_book_by_id(id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.post("/api/Books", response_model=int, tags=["Books"], operation_id="CreateBook")
async def create_book(command: CreateBookCommand):
    book_id = db.create_book(
        title=command.title,
        author=command.author,
        isbn=command.isbn,
        publication_year=command.publication_year,
        publisher=command.publisher,
        genre=command.genre,
        pages=command.pages,
        rating=command.rating,
        description=command.description
    )
    return book_id


@app.put("/api/Books/{id}", tags=["Books"], operation_id="UpdateBook")
async def update_book(id: int, command: UpdateBookCommand):
    success = db.update_book(
        id=id,
        title=command.title,
        author=command.author,
        isbn=command.isbn,
        publication_year=command.publication_year,
        publisher=command.publisher,
        genre=command.genre,
        pages=command.pages,
        rating=command.rating,
        description=command.description
    )
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    
    return Response(status_code=200)


@app.delete("/api/Books/{id}", tags=["Books"], operation_id="DeleteBook")
async def delete_book(id: int):
    success = db.delete_book(id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    
    return Response(status_code=200)
