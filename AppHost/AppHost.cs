var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.ApiService>("apiservice")
    .WithHttpHealthCheck("/health");

// The Python API is experimental and subject to change
#pragma warning disable ASPIREHOSTINGPYTHON001
var pythonApi = builder.AddPythonApp("pythonapi","../PythonApi","run_app.py")
    .WithHttpEndpoint(port: 8000, env: "PORT")
    .WithExternalHttpEndpoints();
#pragma warning restore ASPIREHOSTINGPYTHON001

builder.AddNpmApp("web", "../web", "dev")
    .WithReference(apiService)
    .WithReference(pythonApi)
    .WithHttpEndpoint(3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
