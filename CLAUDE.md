# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend Development
```bash
# Build the entire solution
dotnet build

# Run the application (starts all services via Aspire)
dotnet run --project AppHost

# Run API service individually
dotnet run --project ApiService
```

### Frontend Development
```bash
# Install dependencies (uses pnpm, not npm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint the codebase
pnpm lint

# Generate API client from OpenAPI spec (run after API changes)
pnpm generate-api
```

## Architecture

This is a full-stack application using **CQRS with Mediator pattern** on the backend and **Next.js with RTK Query** on the frontend.

### Backend Architecture (ASP.NET Core)
- **CQRS Pattern**: Commands and Queries are separated in `ApiService/Todo/Commands/` and `ApiService/Todo/Queries/`
- **MediatR**: All business logic flows through MediatR handlers, controllers are thin
- **Entity Framework Core**: Data access via DbContext in `ApiService/Data/`
- **API-First**: OpenAPI spec is auto-generated, frontend consumes it via code generation

### Frontend Architecture (Next.js)
- **Next.js App Router**: Pages in `web/src/app/` using modern React Server Components where applicable
- **RTK Query**: API client is auto-generated in `web/src/store/api/` from OpenAPI spec
- **Component Library**: Uses Shadcn/ui components with Tailwind CSS for styling
- **State Management**: Redux Toolkit primarily for API caching via RTK Query

### Key Development Workflow
1. Make backend API changes in `ApiService/`
2. Backend automatically generates OpenAPI spec on build
3. Run `pnpm generate-api` in `web/` to update TypeScript client
4. Frontend automatically has type-safe API access

### Code Conventions
- **Backend**: Use primary constructors, nameof operator for HTTP methods, shortest possible namespaces
- **Frontend**: Prefer Shadcn/ui components, use Tailwind classes, leverage RTK Query hooks for all API calls
- **Both**: Maintain strong typing throughout, no magic strings for API endpoints