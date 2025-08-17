import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database import InMemoryDatabase
from models import TodoItem


class TestInMemoryDatabase:
    """Unit tests for the InMemoryDatabase class"""
    
    def setup_method(self):
        """Create a fresh database instance for each test"""
        self.db = InMemoryDatabase()
    
    def test_initial_state(self):
        """Test that database starts empty"""
        todos = self.db.get_all_todos()
        assert todos == []
        assert len(todos) == 0
    
    def test_create_single_todo(self):
        """Test creating a single todo"""
        todo_id = self.db.create_todo("Test Todo")
        assert todo_id == 1
        
        todos = self.db.get_all_todos()
        assert len(todos) == 1
        assert todos[0].id == 1
        assert todos[0].title == "Test Todo"
        assert todos[0].isComplete == False
    
    def test_create_multiple_todos(self):
        """Test creating multiple todos with unique IDs"""
        id1 = self.db.create_todo("First Todo")
        id2 = self.db.create_todo("Second Todo")
        id3 = self.db.create_todo("Third Todo")
        
        assert id1 == 1
        assert id2 == 2
        assert id3 == 3
        
        todos = self.db.get_all_todos()
        assert len(todos) == 3
        assert todos[0].title == "First Todo"
        assert todos[1].title == "Second Todo"
        assert todos[2].title == "Third Todo"
    
    def test_update_existing_todo(self):
        """Test updating an existing todo"""
        todo_id = self.db.create_todo("Original Title")
        
        success = self.db.update_todo(todo_id, "Updated Title", True)
        assert success == True
        
        todo = self.db.get_todo_by_id(todo_id)
        assert todo is not None
        assert todo.title == "Updated Title"
        assert todo.isComplete == True
    
    def test_update_nonexistent_todo(self):
        """Test updating a todo that doesn't exist"""
        success = self.db.update_todo(999, "Title", False)
        assert success == False
    
    def test_delete_existing_todo(self):
        """Test deleting an existing todo"""
        id1 = self.db.create_todo("Todo 1")
        id2 = self.db.create_todo("Todo 2")
        
        success = self.db.delete_todo(id1)
        assert success == True
        
        todos = self.db.get_all_todos()
        assert len(todos) == 1
        assert todos[0].id == id2
        assert todos[0].title == "Todo 2"
    
    def test_delete_nonexistent_todo(self):
        """Test deleting a todo that doesn't exist"""
        success = self.db.delete_todo(999)
        assert success == False
    
    def test_get_todo_by_id(self):
        """Test retrieving a specific todo by ID"""
        id1 = self.db.create_todo("Todo 1")
        id2 = self.db.create_todo("Todo 2")
        
        todo = self.db.get_todo_by_id(id1)
        assert todo is not None
        assert todo.id == id1
        assert todo.title == "Todo 1"
        
        todo = self.db.get_todo_by_id(id2)
        assert todo is not None
        assert todo.id == id2
        assert todo.title == "Todo 2"
        
        todo = self.db.get_todo_by_id(999)
        assert todo is None
    
    def test_delete_and_update_sequence(self):
        """Test the bug scenario: create 2 todos, delete second, update first"""
        id1 = self.db.create_todo("First Todo")
        id2 = self.db.create_todo("Second Todo")
        
        # Delete the second todo
        success = self.db.delete_todo(id2)
        assert success == True
        
        # Update the first todo (this was failing before the fix)
        success = self.db.update_todo(id1, "Updated First Todo", True)
        assert success == True
        
        # Verify the update worked
        todo = self.db.get_todo_by_id(id1)
        assert todo is not None
        assert todo.title == "Updated First Todo"
        assert todo.isComplete == True
        
        # Verify only one todo remains
        todos = self.db.get_all_todos()
        assert len(todos) == 1
    
    def test_id_persistence_after_deletion(self):
        """Test that IDs continue incrementing even after deletions"""
        id1 = self.db.create_todo("Todo 1")
        id2 = self.db.create_todo("Todo 2")
        
        # Delete all todos
        self.db.delete_todo(id1)
        self.db.delete_todo(id2)
        
        # Create new todos - IDs should continue from 3
        id3 = self.db.create_todo("Todo 3")
        id4 = self.db.create_todo("Todo 4")
        
        assert id3 == 3
        assert id4 == 4
        
        todos = self.db.get_all_todos()
        assert len(todos) == 2
        assert todos[0].id == 3
        assert todos[1].id == 4
    
    def test_concurrent_operations(self):
        """Test thread safety with concurrent operations"""
        import threading
        import time
        
        results = []
        
        def create_todos():
            for i in range(10):
                todo_id = self.db.create_todo(f"Concurrent {i}")
                results.append(todo_id)
        
        # Create multiple threads
        threads = [threading.Thread(target=create_todos) for _ in range(3)]
        
        # Start all threads
        for t in threads:
            t.start()
        
        # Wait for completion
        for t in threads:
            t.join()
        
        # Check that we have 30 todos with unique IDs
        todos = self.db.get_all_todos()
        assert len(todos) == 30
        assert len(set(results)) == 30  # All IDs should be unique