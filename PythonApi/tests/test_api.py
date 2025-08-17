import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app
from database import db


@pytest.fixture(autouse=True)
def reset_database():
    """Reset the database before each test"""
    db._todos.clear()
    db._next_id = 1
    yield
    db._todos.clear()
    db._next_id = 1


class TestTodoAPI:
    """Integration tests for the Todo API endpoints"""
    
    def setup_method(self):
        """Create a test client for each test"""
        self.client = TestClient(app)
    
    def test_get_empty_todos(self):
        """Test getting todos when database is empty"""
        response = self.client.get("/api/Todos")
        assert response.status_code == 200
        assert response.json() == []
    
    def test_create_todo(self):
        """Test creating a new todo"""
        response = self.client.post(
            "/api/Todos",
            json={"title": "Test Todo"}
        )
        assert response.status_code == 200
        assert response.json() == 1
        
        # Verify it was created
        response = self.client.get("/api/Todos")
        assert response.status_code == 200
        todos = response.json()
        assert len(todos) == 1
        assert todos[0]["id"] == 1
        assert todos[0]["title"] == "Test Todo"
        assert todos[0]["isComplete"] == False
    
    def test_create_multiple_todos(self):
        """Test creating multiple todos"""
        titles = ["First", "Second", "Third"]
        created_ids = []
        
        for title in titles:
            response = self.client.post(
                "/api/Todos",
                json={"title": title}
            )
            assert response.status_code == 200
            created_ids.append(response.json())
        
        assert created_ids == [1, 2, 3]
        
        # Verify all were created
        response = self.client.get("/api/Todos")
        todos = response.json()
        assert len(todos) == 3
        for i, todo in enumerate(todos):
            assert todo["id"] == i + 1
            assert todo["title"] == titles[i]
    
    def test_update_todo(self):
        """Test updating an existing todo"""
        # Create a todo
        create_response = self.client.post(
            "/api/Todos",
            json={"title": "Original"}
        )
        todo_id = create_response.json()
        
        # Update it
        update_response = self.client.put(
            f"/api/Todos/{todo_id}",
            json={"title": "Updated", "isComplete": True}
        )
        assert update_response.status_code == 200
        
        # Verify the update
        response = self.client.get("/api/Todos")
        todos = response.json()
        assert len(todos) == 1
        assert todos[0]["title"] == "Updated"
        assert todos[0]["isComplete"] == True
    
    def test_update_nonexistent_todo(self):
        """Test updating a todo that doesn't exist"""
        response = self.client.put(
            "/api/Todos/999",
            json={"title": "Updated", "isComplete": True}
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "Todo not found"
    
    def test_delete_todo(self):
        """Test deleting an existing todo"""
        # Create two todos
        response1 = self.client.post("/api/Todos", json={"title": "Todo 1"})
        id1 = response1.json()
        response2 = self.client.post("/api/Todos", json={"title": "Todo 2"})
        id2 = response2.json()
        
        # Delete the first one
        delete_response = self.client.delete(f"/api/Todos/{id1}")
        assert delete_response.status_code == 200
        
        # Verify only second remains
        response = self.client.get("/api/Todos")
        todos = response.json()
        assert len(todos) == 1
        assert todos[0]["id"] == id2
        assert todos[0]["title"] == "Todo 2"
    
    def test_delete_nonexistent_todo(self):
        """Test deleting a todo that doesn't exist"""
        response = self.client.delete("/api/Todos/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Todo not found"
    
    def test_bug_scenario_delete_then_update(self):
        """Test the specific bug: create 2, delete 2nd, update 1st"""
        # Create two todos
        response1 = self.client.post("/api/Todos", json={"title": "First Todo"})
        id1 = response1.json()
        response2 = self.client.post("/api/Todos", json={"title": "Second Todo"})
        id2 = response2.json()
        
        # Delete the second todo
        delete_response = self.client.delete(f"/api/Todos/{id2}")
        assert delete_response.status_code == 200
        
        # Update the first todo (this was the bug)
        update_response = self.client.put(
            f"/api/Todos/{id1}",
            json={"title": "Updated First", "isComplete": True}
        )
        assert update_response.status_code == 200
        
        # Verify the update worked
        response = self.client.get("/api/Todos")
        todos = response.json()
        assert len(todos) == 1
        assert todos[0]["id"] == id1
        assert todos[0]["title"] == "Updated First"
        assert todos[0]["isComplete"] == True
    
    def test_complex_workflow(self):
        """Test a complex workflow with multiple operations"""
        # Create 3 todos
        ids = []
        for i in range(1, 4):
            response = self.client.post("/api/Todos", json={"title": f"Todo {i}"})
            ids.append(response.json())
        
        # Update the middle one
        self.client.put(
            f"/api/Todos/{ids[1]}",
            json={"title": "Middle Updated", "isComplete": True}
        )
        
        # Delete the first one
        self.client.delete(f"/api/Todos/{ids[0]}")
        
        # Create a new one
        response = self.client.post("/api/Todos", json={"title": "New Todo"})
        new_id = response.json()
        
        # Get all todos
        response = self.client.get("/api/Todos")
        todos = response.json()
        
        # Should have 3 todos
        assert len(todos) == 3
        
        # Check the remaining todos
        todo_ids = [t["id"] for t in todos]
        assert ids[1] in todo_ids  # Middle one still exists
        assert ids[2] in todo_ids  # Last one still exists
        assert new_id in todo_ids  # New one exists
        
        # Check the updated one
        middle_todo = next(t for t in todos if t["id"] == ids[1])
        assert middle_todo["title"] == "Middle Updated"
        assert middle_todo["isComplete"] == True
    
    def test_cors_headers(self):
        """Test that CORS headers are properly set"""
        # Make a request with an Origin header to trigger CORS
        response = self.client.get(
            "/api/Todos",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        # CORS headers should be present in the response
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*"
        assert "access-control-allow-credentials" in response.headers
    
    def test_empty_title_handling(self):
        """Test creating a todo with empty title"""
        response = self.client.post(
            "/api/Todos",
            json={"title": ""}
        )
        # Empty string is still a valid string
        assert response.status_code == 200
        
        # Verify it was created with empty title
        todos = self.client.get("/api/Todos").json()
        assert len(todos) == 1
        assert todos[0]["title"] == ""
    
    def test_special_characters_in_title(self):
        """Test todos with special characters"""
        special_titles = [
            "Todo with émojis 🎉🚀",
            "Todo with <html>tags</html>",
            "Todo with \"quotes\" and 'apostrophes'",
            "Todo with line\nbreaks",
            "Todo with tabs\tand spaces"
        ]
        
        for title in special_titles:
            response = self.client.post("/api/Todos", json={"title": title})
            assert response.status_code == 200
        
        todos = self.client.get("/api/Todos").json()
        assert len(todos) == len(special_titles)
        
        for i, todo in enumerate(todos):
            assert todo["title"] == special_titles[i]