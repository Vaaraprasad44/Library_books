from typing import List, Optional
from models import TodoItem
import threading


class InMemoryDatabase:
    def __init__(self):
        self._todos: List[TodoItem] = []
        self._next_id = 1
        self._lock = threading.Lock()
    
    def get_all_todos(self) -> List[TodoItem]:
        with self._lock:
            return self._todos.copy()
    
    def create_todo(self, title: str) -> int:
        with self._lock:
            todo = TodoItem(
                id=self._next_id,
                title=title,
                isComplete=False
            )
            self._todos.append(todo)
            self._next_id += 1
            return todo.id
    
    def update_todo(self, id: int, title: str, is_complete: bool) -> bool:
        with self._lock:
            for todo in self._todos:
                if todo.id == id:
                    todo.title = title
                    todo.isComplete = is_complete
                    return True
            return False
    
    def delete_todo(self, id: int) -> bool:
        with self._lock:
            for i, todo in enumerate(self._todos):
                if todo.id == id:
                    del self._todos[i]
                    return True
            return False
    
    def get_todo_by_id(self, id: int) -> Optional[TodoItem]:
        with self._lock:
            for todo in self._todos:
                if todo.id == id:
                    return todo
            return None


db = InMemoryDatabase()