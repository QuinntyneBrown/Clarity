# Clarity

A Kanban board application built with ASP.NET Core and Angular.

## Tech Stack

**Backend:** .NET 8, ASP.NET Core, Entity Framework Core, MediatR, Serilog

**Frontend:** Angular 19, Angular Material 19, NgRx Component Store, RxJS, TypeScript 5.8

**Testing:** Playwright (E2E), xUnit (.NET)

## Project Structure

```
src/
  Clarity.Api/              ASP.NET Core Web API
  Clarity.Core/             Domain models and interfaces
  Clarity.Infrastructure/   Data access and EF Core
  Clarity.Web/              Angular frontend
test/
  Clarity.UnitTests/        .NET unit tests
  Clarity.IntegrationTests/ .NET integration tests
  Clarity.Testing/          Shared test utilities
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18.19+](https://nodejs.org/en/download)
- SQL Server LocalDB or SQL Server Express

## Running Locally

### API

```sh
cd src/Clarity.Api
dotnet run
```

The API will be available at `https://localhost:5001`.

### Frontend

```sh
cd src/Clarity.Web
npm install
npm start
```

The app will be available at `http://localhost:4200`.

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
