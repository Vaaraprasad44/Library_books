namespace ApiService.Todo.Commands;

using MediatR;
using Data;

public record UpdateTodoCommand(int Id, string Title, bool IsComplete) : IRequest<Unit>;

public class UpdateTodoCommandHandler(TodoDbContext context) : IRequestHandler<UpdateTodoCommand, Unit>
{
    public async Task<Unit> Handle(UpdateTodoCommand request, CancellationToken cancellationToken)
    {
        var todo = await context.Todos.FindAsync(request.Id);

        if (todo == null)
        {
            // Handle not found
            return Unit.Value;
        }

        todo.Title = request.Title;
        todo.IsComplete = request.IsComplete;

        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
