# Clarity

A Kanban board application built with ASP.NET Core and Angular, deployed to Azure Container Apps.

## Tech Stack

**Backend:** .NET 8, ASP.NET Core, Entity Framework Core, MediatR, SignalR, Serilog

**Frontend:** Angular 19, Angular Material 19, NgRx Component Store, RxJS, TypeScript 5.8

**Infrastructure:** Azure Container Apps, Azure SQL Database, Azure Container Registry, Key Vault, Bicep

**CI/CD:** GitHub Actions, Azure Developer CLI (`azd`)

**Observability:** Log Analytics

**Testing:** Playwright (E2E), xUnit, Moq (.NET)

## Project Structure

```
backend/
  Clarity.sln
  src/
    Clarity.Api/              ASP.NET Core Web API (hosts Angular frontend in wwwroot)
    Clarity.Core/             Domain models and interfaces
    Clarity.Infrastructure/   Data access and EF Core
  tests/
    Clarity.UnitTests/        .NET unit tests
    Clarity.IntegrationTests/ .NET integration tests
    Clarity.Testing/          Shared test utilities and builders
frontend/                     Angular workspace
  projects/
    api/                      @api library (API models and services)
    components/               @components library (shared UI components)
    clarity/                  Main application
    clarity-admin/            Admin application
designs/
  clarity.pen                 UI designs for the main application
infra/
  modules/                    Bicep modules (Container Apps, SQL Server, Key Vault, Container Registry)
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download) (includes .NET 8 targeting)
- [Node.js 20+](https://nodejs.org/en/download)
- SQL Server LocalDB or SQL Server Express
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) (optional, for deployment)

## Running Locally

### API

```sh
cd backend/src/Clarity.Api
dotnet run
```

The API will be available at `https://localhost:5001`.

### Frontend

```sh
cd frontend
npm install
npx ng build @api
npx ng build @components
npm start
```

The app will be available at `http://localhost:4200`.

### Database Commands

```sh
cd backend/src/Clarity.Api
dotnet run -- migratedb   # Apply EF Core migrations
dotnet run -- seeddb      # Seed sample data
dotnet run -- dropdb      # Drop the database
dotnet run -- ci          # Drop, migrate, seed, then stop
```

## Building

The Angular workspace has library dependencies that must be built in order:

```sh
cd frontend
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
cd frontend
npx playwright test
```
