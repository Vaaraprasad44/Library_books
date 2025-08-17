from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, RedirectResponse
from typing import List
from models import TodoItem, CreateTodoCommand, UpdateTodoCommand
from database import db

app = FastAPI(title="Todos API", version="v1", docs_url="/swagger", redoc_url="/redoc")
app.title = "Todos API"
app.version = "v1"
app.description = "Todos API"

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

@app.get("/api/Todos", response_model=List[TodoItem], tags=["Todos"], operation_id="GetTodos")
async def get_todos():
    return db.get_all_todos()


@app.post("/api/Todos", response_model=int, tags=["Todos"], operation_id="CreateTodo")
async def create_todo(command: CreateTodoCommand):
    todo_id = db.create_todo(command.title)
    return todo_id


@app.put("/api/Todos/{id}", tags=["Todos"], operation_id="UpdateTodo")
async def update_todo(id: int, command: UpdateTodoCommand):
    # Use the ID from the path, not from the command body
    success = db.update_todo(id, command.title, command.isComplete)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return Response(status_code=200)


@app.delete("/api/Todos/{id}", tags=["Todos"], operation_id="DeleteTodo")
async def delete_todo(id: int):
    success = db.delete_todo(id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return Response(status_code=200)
