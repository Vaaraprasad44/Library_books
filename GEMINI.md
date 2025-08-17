This project uses Aspire framework for developing microservices applications and is intended to be deployed to Azure Cloud using PaaS services
The ApiService project uses Asp.Net Core Web API, CQRS, Mediator, DTO and AutoMapper. NSwag is used to generate OpenAPI specification as JSON file during build.
The OpenAPI json file is used to generate RTK Query api slices in the web project during build.
The web project uses Next.js with App router, Shadcn/ui, Tailwind CSS and RTK Query to connect to the ApiService.


Always use primary constructor in C# when possible
Define the namespace in first in C# files. Use the shortest possible namespaces by omitting overlapping leading namespace parts in using statements.
Always specify an explicit and meaningful name attribute for HTTP controller methods. Use the nameof operator to ensure the operation name is the same as the HTTP controller method name.

Always use pnpm to install packages and run scripts.
Always use shadcn/ui controls where possible instead of HTML controls.
Always use tailwindCSS classes instead of raw CSS when possible.