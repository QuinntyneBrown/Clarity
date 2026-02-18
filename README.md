# Clarity

A Kanban board application built with ASP.NET Core and Angular, deployed to Azure Container Apps.

## Tech Stack

**Backend:** .NET 8, ASP.NET Core, Entity Framework Core, MediatR, SignalR, Serilog

**Frontend:** Angular 19, Angular Material 19, NgRx Component Store, RxJS, TypeScript 5.8

**Orchestration:** .NET Aspire 9.0

**Infrastructure:** Azure Container Apps, Azure SQL Database, Azure Container Registry, Key Vault, Bicep

**CI/CD:** GitHub Actions, Azure Developer CLI (`azd`)

**Observability:** OpenTelemetry, Health Checks, Log Analytics

**Testing:** Playwright (E2E), xUnit, Moq (.NET)

## Project Structure

```
src/
  Clarity.AppHost/          .NET Aspire orchestration (SQL Server, API, Web)
  Clarity.ServiceDefaults/  Shared service configuration (OpenTelemetry, health checks, resilience)
  Clarity.Api/              ASP.NET Core Web API (hosts Angular frontend in wwwroot)
  Clarity.Core/             Domain models and interfaces
  Clarity.Infrastructure/   Data access and EF Core
  Clarity.Web/              Angular frontend workspace
    projects/
      api/                  @api library (API models and services)
      components/           @components library (shared UI components)
      clarity/              Main application
      clarity-admin/        Admin application
designs/
  clarity.pen               UI designs for the main application
test/
  Clarity.UnitTests/        .NET unit tests
  Clarity.IntegrationTests/ .NET integration tests
  Clarity.Testing/          Shared test utilities and builders
infra/
  modules/                  Bicep modules (Container Apps, SQL Server, Key Vault, Container Registry)
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download) (includes .NET 8 targeting)
- [Node.js 20+](https://nodejs.org/en/download)
- SQL Server LocalDB or SQL Server Express
- [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling) (optional, for orchestrated runs)
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) (optional, for deployment)

## Running Locally

### With .NET Aspire (recommended)

```sh
cd src/Clarity.AppHost
dotnet run
```

This starts the full stack — SQL Server, API, and Angular frontend — with service discovery, health checks, and the Aspire dashboard.

### Standalone

#### API

```sh
cd src/Clarity.Api
dotnet run
```

The API will be available at `https://localhost:5001`.

#### Frontend

```sh
cd src/Clarity.Web
npm install
npx ng build @api
npx ng build @components
npm start
```

The app will be available at `http://localhost:4200`.

### Database Commands

```sh
cd src/Clarity.Api
dotnet run -- migratedb   # Apply EF Core migrations
dotnet run -- seeddb      # Seed sample data
dotnet run -- dropdb      # Drop the database
dotnet run -- ci          # Drop, migrate, seed, then stop
```

## Building

The Angular workspace has library dependencies that must be built in order:

```sh
cd src/Clarity.Web
npm ci
npx ng build @api
npx ng build @components
npx ng build clarity --configuration production
```

## Deployment

The application deploys to Azure Container Apps via GitHub Actions on every push to `main`. The pipeline:

1. Builds and tests the .NET solution
2. Authenticates with Azure using federated credentials (OIDC)
3. Runs `azd deploy` which builds the Angular frontend, copies it to the API's `wwwroot`, and deploys the container

### Manual Deployment

```sh
azd auth login
azd deploy
```

## Tests

### .NET Tests

```sh
dotnet test
```

### E2E Tests

```sh
cd src/Clarity.Web
npx playwright test
```
