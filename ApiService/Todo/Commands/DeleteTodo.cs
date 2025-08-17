namespace ApiService.Todo.Commands;

using MediatR;
using Data;

public record DeleteTodoCommand(int Id) : IRequest<Unit>;

public class DeleteTodoCommandHandler(TodoDbContext context) : IRequestHandler<DeleteTodoCommand, Unit>
{
    public async Task<Unit> Handle(DeleteTodoCommand request, CancellationToken cancellationToken)
    {
        var todo = await context.Todos.FindAsync(request.Id);

        if (todo == null)
        {
            // Handle not found
            return Unit.Value;
        }

        context.Todos.Remove(todo);

        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
