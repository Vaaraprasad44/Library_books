namespace ApiService.Todo.Queries;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Data;
using DTO;

public record GetTodosQuery : IRequest<IEnumerable<TodoItem>>;

public class GetTodosQueryHandler(TodoDbContext context) : IRequestHandler<GetTodosQuery, IEnumerable<TodoItem>>
{
    public async Task<IEnumerable<TodoItem>> Handle(GetTodosQuery request, CancellationToken cancellationToken)
    {
        return await context.Todos
            .Select(x => new TodoItem { Id = x.Id, Title = x.Title, IsComplete = x.IsComplete })
            .ToListAsync(cancellationToken);
    }
}
