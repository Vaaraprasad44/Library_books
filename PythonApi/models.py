from pydantic import BaseModel
from typing import Optional


class TodoItem(BaseModel):
    id: int
    title: Optional[str] = None
    isComplete: bool = False


class CreateTodoCommand(BaseModel):
    title: str


class UpdateTodoCommand(BaseModel):
    title: str
    isComplete: bool