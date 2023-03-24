// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core;
using Clarity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
.Enrich.FromLogContext()
.WriteTo.Console()
.CreateBootstrapLogger();

try
{
    Log.Information("Starting web host");

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddCoreServices(builder.Environment, builder.Configuration);

    builder.Services.AddInfrastructureServices(builder.Configuration.GetConnectionString("DefaultConnection")!);

    builder.Services.AddApiServices();

    var app = builder.Build();

    app.UseSwagger(options => options.SerializeAsV2 = true);

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Clarity");
        options.RoutePrefix = string.Empty;
        options.DisplayOperationId();
    });

    app.UseCors("CorsPolicy");

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.MapHub<ClarityHub>("/hub");

    var services = (IServiceScopeFactory)app.Services.GetRequiredService(typeof(IServiceScopeFactory));

    using (var scope = services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ClarityDbContext>();

        if (args.Contains("ci"))
            args = new string[4] { "dropdb", "migratedb", "seeddb", "stop" };

        if (args.Contains("dropdb"))
        {
            context.Database.ExecuteSql($"DROP TABLE TicketState");

            context.Database.ExecuteSql($"DROP TABLE Boards");

            context.Database.ExecuteSql($"DROP TABLE BoardStates");

            context.Database.ExecuteSql($"DROP TABLE Comments");

            context.Database.ExecuteSql($"DROP TABLE TicketEffortChanged");

            context.Database.ExecuteSql($"DROP TABLE Tickets");

            context.Database.ExecuteSql($"DROP TABLE Users");

            context.Database.ExecuteSql($"DROP TABLE Digitalassets");

            context.Database.ExecuteSql($"DROP TABLE TeamMembers");

            context.Database.ExecuteSql($"DROP SCHEMA Clarity");

            context.Database.ExecuteSql($"DELETE from __EFMigrationsHistory where MigrationId like '%_Clarity_%';");
        }

        if (args.Contains("migratedb"))
        {
            context.Database.Migrate();
        }

        if (args.Contains("seeddb"))
        {
            context.Seed();
        }

        if (args.Contains("stop"))
            Environment.Exit(0);
    }

    app.Run();

}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }