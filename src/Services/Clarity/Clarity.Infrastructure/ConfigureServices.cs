// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core;
using Clarity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddInfrastructureServices(this IServiceCollection services, string connectionString)
    {
        services.AddTransient<IClarityDbContext, ClarityDbContext>();

        services.AddDbContext<ClarityDbContext>(options =>
        {
            options.UseSqlServer(connectionString,
                builder => builder.MigrationsAssembly("Clarity.Infrastructure")
                    .EnableRetryOnFailure())
            .LogTo(Console.WriteLine)
            .EnableSensitiveDataLogging();
        });

    }
}


