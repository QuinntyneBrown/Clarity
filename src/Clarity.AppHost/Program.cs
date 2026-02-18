var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql")
    .AddDatabase("DefaultConnection");

var api = builder.AddProject<Projects.Clarity_Api>("api")
    .WithReference(sql)
    .WaitFor(sql);

builder.AddNpmApp("web", "../Clarity.Web")
    .WithReference(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
