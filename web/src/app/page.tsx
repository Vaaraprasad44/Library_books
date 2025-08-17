'use client'

import { useState } from "react";
import { useGetTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from "@/store/api/enhanced/todos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function TodosPage() {
    const { data: todos, isLoading, isError } = useGetTodosQuery();
    const [createTodo] = useCreateTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();
    const [newTodoTitle, setNewTodoTitle] = useState("");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !todos) {
        return <div>Error loading todos.</div>;
    }

    const handleCreateTodo = () => {
        if (newTodoTitle.trim()) {
            createTodo({ createTodoCommand: { title: newTodoTitle } });
            setNewTodoTitle("");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Todos</h1>
            <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
                <Input
                    type="text"
                    placeholder="Add a new todo"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                />
                <Button onClick={handleCreateTodo}>Add Todo</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Complete</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {todos.map((todo) => (
                        <TableRow key={todo.id}>
                            <TableCell>
                                <Checkbox
                                    checked={todo.isComplete!}
                                    onCheckedChange={() => updateTodo({ id: todo.id!, updateTodoCommand: { id: todo.id!, title: todo.title ?? "", isComplete: !todo.isComplete } })}
                                />
                            </TableCell>
                            <TableCell>{todo.title}</TableCell>
                            <TableCell>
                                <Button variant="destructive" onClick={() => deleteTodo({ id: todo.id! })}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}