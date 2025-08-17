# Todo API - Python FastAPI Implementation

A FastAPI implementation of the Todo API matching the OpenAPI specification from the ASP.NET Core project.

## Features

- RESTful API for Todo CRUD operations
- In-memory database with thread-safe operations  
- CORS enabled for cross-origin requests
- Comprehensive test coverage (91%)
- Auto-generated API documentation at `/swagger`

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Swagger documentation: `http://localhost:8000/swagger`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

- `GET /api/Todos` - Get all todos
- `POST /api/Todos` - Create a new todo
- `PUT /api/Todos/{id}` - Update an existing todo
- `DELETE /api/Todos/{id}` - Delete a todo

## Testing

The project includes comprehensive unit and integration tests.

### Run all tests
```bash
pytest
```

### Run tests quietly (less verbose)
```bash
pytest -q
```

### Run specific test file
```bash
pytest tests/test_database.py  # Unit tests for database
pytest tests/test_api.py       # Integration tests for API
```

### Run specific test
```bash
pytest tests/test_api.py::TestTodoAPI::test_create_todo
```

The tests include:
- **Unit tests** (`test_database.py`): Test the in-memory database operations
- **Integration tests** (`test_api.py`): Test the complete API endpoints
- **Edge cases**: Empty titles, special characters, concurrent operations
- **Bug regression tests**: Specific test for the delete-then-update scenario

## Project Structure

```
PythonApi/
├── main.py                 # FastAPI application and endpoints
├── models.py              # Pydantic models for request/response
├── database.py            # In-memory database implementation
├── requirements.txt      # Python dependencies
├── pytest.ini            # Pytest configuration
├── README.md            # This file
└── tests/               # Test directory
    ├── __init__.py      # Tests package marker
    ├── test_database.py # Unit tests for database
    └── test_api.py      # Integration tests for API
```

## Integration with Aspire

This project is designed to be orchestrated by .NET Aspire. Container orchestration is handled at the Aspire level, not within this Python project.