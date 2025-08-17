namespace ApiService.Data;

using Microsoft.EntityFrameworkCore;
using Todo.Models;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos { get; set; } = null!;
}
