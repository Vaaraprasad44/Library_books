namespace ApiService.Controllers;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Todo.Commands;
using Todo.Queries;
using Todo.DTO;

[ApiController]
[Route("api/[controller]")]
public class TodosController(IMediator mediator) : ControllerBase
{
    [HttpGet(Name = nameof(GetTodos))]
    public async Task<IEnumerable<TodoItem>> GetTodos()
    {
        return await mediator.Send(new GetTodosQuery());
    }

    [HttpPost(Name = nameof(CreateTodo))]
    public async Task<ActionResult<int>> CreateTodo(CreateTodoCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpPut("{id}", Name = nameof(UpdateTodo))]
    public async Task<IActionResult> UpdateTodo(int id, UpdateTodoCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}", Name = nameof(DeleteTodo))]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        await mediator.Send(new DeleteTodoCommand(id));

        return NoContent();
    }
}
