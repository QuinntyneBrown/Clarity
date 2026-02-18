# Clarity

A Kanban board application built with ASP.NET Core and Angular, orchestrated with .NET Aspire.

## Tech Stack

**Backend:** .NET 8, ASP.NET Core, Entity Framework Core, MediatR, SignalR, Serilog

**Frontend:** Angular 19, Angular Material 19, NgRx Component Store, RxJS, TypeScript 5.8

**Orchestration:** .NET Aspire 9.0

**Infrastructure:** Azure (App Service, SQL Database, Key Vault), Bicep

**Observability:** OpenTelemetry, Health Checks

**Testing:** Playwright (E2E), xUnit, Moq (.NET)

## Project Structure

```
src/
  Clarity.AppHost/          .NET Aspire orchestration (SQL Server, API, Web)
  Clarity.ServiceDefaults/  Shared service configuration (OpenTelemetry, health checks, resilience)
  Clarity.Api/              ASP.NET Core Web API
  Clarity.Core/             Domain models and interfaces
  Clarity.Infrastructure/   Data access and EF Core
  Clarity.Web/              Angular frontend
test/
  Clarity.UnitTests/        .NET unit tests
  Clarity.IntegrationTests/ .NET integration tests
  Clarity.Testing/          Shared test utilities and builders
infra/
  modules/                  Bicep modules (App Service, SQL Server, Key Vault)
  parameters/               Environment-specific parameters
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download) (includes .NET 8 targeting)
- [Node.js 18.19+](https://nodejs.org/en/download)
- SQL Server LocalDB or SQL Server Express
- [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling) (optional, for orchestrated runs)

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
