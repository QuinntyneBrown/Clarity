var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql")
    .AddDatabase("DefaultConnection");

var api = builder.AddProject<Projects.Clarity_Api>("api")
    .WithReference(sql)
    .WaitFor(sql)
    .WithHttpsEndpoint(port: 50124, name: "https")
    .WithArgs("migratedb", "seeddb");

builder.AddNpmApp("web", "../Clarity.Web")
    .WithReference(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
