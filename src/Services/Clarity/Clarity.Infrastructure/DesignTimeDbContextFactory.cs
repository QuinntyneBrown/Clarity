// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ClarityDbContext>
{
    public ClarityDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<ClarityDbContext>();
        var basePath = Path.GetFullPath("../Clarity/Clarity.Api");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", false)
            .Build();

        builder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

        return new ClarityDbContext(builder.Options);
    }
}