from typing import List, Optional
from models import Book
import threading
import csv
import os


class InMemoryDatabase:
    def __init__(self):
        self._books: List[Book] = []
        self._next_book_id = 1
        self._lock = threading.Lock()
        self._load_books_from_csv()
    
    def _load_books_from_csv(self):
        """Load books from CSV file if it exists"""
        csv_path = os.path.join(os.path.dirname(__file__), "books_data.csv")
        if os.path.exists(csv_path):
            try:
                with open(csv_path, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    for row in reader:
                        book = Book(
                            id=self._next_book_id,
                            title=row.get('title', ''),
                            author=row.get('author', ''),
                            isbn=row.get('isbn') or None,
                            publication_year=int(row['publication_year']) if row.get('publication_year') and row['publication_year'].isdigit() else None,
                            publisher=row.get('publisher') or None,
                            genre=row.get('genre') or None,
                            pages=int(row['pages']) if row.get('pages') and row['pages'].isdigit() else None,
                            rating=float(row['rating']) if row.get('rating') and row['rating'].replace('.', '').isdigit() else None,
                            description=row.get('description') or None
                        )
                        self._books.append(book)
                        self._next_book_id += 1
            except Exception as e:
                print(f"Error loading books from CSV: {e}")
    
    # Book methods
    def get_all_books(self) -> List[Book]:
        with self._lock:
            return self._books.copy()
    
    def search_books_by_title(self, title: str) -> List[Book]:
        with self._lock:
            return [book for book in self._books if title.lower() in book.title.lower()]
    
    def search_books_by_author(self, author: str) -> List[Book]:
        with self._lock:
            return [book for book in self._books if author.lower() in book.author.lower()]
    
    def get_book_by_id(self, id: int) -> Optional[Book]:
        with self._lock:
            for book in self._books:
                if book.id == id:
                    return book
            return None
    
    def create_book(self, title: str, author: str, isbn: Optional[str] = None, 
                   publication_year: Optional[int] = None, publisher: Optional[str] = None,
                   genre: Optional[str] = None, pages: Optional[int] = None,
                   rating: Optional[float] = None, description: Optional[str] = None) -> int:
        with self._lock:
            book = Book(
                id=self._next_book_id,
                title=title,
                author=author,
                isbn=isbn,
                publication_year=publication_year,
                publisher=publisher,
                genre=genre,
                pages=pages,
                rating=rating,
                description=description
            )
            self._books.append(book)
            self._next_book_id += 1
            return book.id
    
    def update_book(self, id: int, title: str, author: str, isbn: Optional[str] = None,
                   publication_year: Optional[int] = None, publisher: Optional[str] = None,
                   genre: Optional[str] = None, pages: Optional[int] = None,
                   rating: Optional[float] = None, description: Optional[str] = None) -> bool:
        with self._lock:
            for book in self._books:
                if book.id == id:
                    book.title = title
                    book.author = author
                    book.isbn = isbn
                    book.publication_year = publication_year
                    book.publisher = publisher
                    book.genre = genre
                    book.pages = pages
                    book.rating = rating
                    book.description = description
                    return True
            return False
    
    def delete_book(self, id: int) -> bool:
        with self._lock:
            for i, book in enumerate(self._books):
                if book.id == id:
                    del self._books[i]
                    return True
            return False


db = InMemoryDatabase()