namespace ApiService.Todo.Commands;

using MediatR;
using Data;
using Models;

public record CreateTodoCommand(string Title) : IRequest<int>;

public class CreateTodoHandler(TodoDbContext context) : IRequestHandler<CreateTodoCommand, int>
{
    public async Task<int> Handle(CreateTodoCommand request, CancellationToken cancellationToken)
    {
        var entity = new Todo
        {
            Title = request.Title,
            IsComplete = false
        };

        context.Todos.Add(entity);

        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
