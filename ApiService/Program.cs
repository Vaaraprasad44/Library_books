using System.Reflection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});
builder.Services.AddProblemDetails();
builder.Services.AddCors();
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ApiService.Data.TodoDbContext>(options =>
{
    options.UseInMemoryDatabase("TodoDb");
});

builder.Services.AddOpenApiDocument(options =>
{
    options.DocumentName = "v1";
    options.Title = "Movies API";
    options.Version = "v1";
    options.UseHttpAttributeNameAsOperationId = true;
    
    options.PostProcess = document =>
    {
        document.BasePath = "/";
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();
app.UseCors(static builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader()
           .WithExposedHeaders("*");
});
app.MapDefaultEndpoints();
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();