// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Clarity.Testing;

public class ApiTestFixture : WebApplicationFactory<Program>
{
    public ClarityDbContext Context { get; private set; }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ClarityDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<ClarityDbContext>(options =>
            {
                options.UseInMemoryDatabase($"InMemoryDbForTesting-{Guid.NewGuid()}");
            });

            var serviceProvider = services.BuildServiceProvider();

            var scope = serviceProvider.CreateScope();

            var scopedServices = scope.ServiceProvider;

            Context = scopedServices.GetRequiredService<ClarityDbContext>();

            Context.Database.EnsureCreated();

            SeedData.Seed(Context);
        });
    }

    public HttpClient CreateAuthenticatedClient(string token = null, string scheme = "Test")
    {
        if (string.IsNullOrEmpty(token))
            token = TokenFactory.CreateToken("Test User", Array.Empty<string>());
        var client = WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddAuthentication(scheme)
                    .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>(
                        scheme, options => { });
            });
        }).CreateClient();

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(scheme, token);

        return client;
    }
}
