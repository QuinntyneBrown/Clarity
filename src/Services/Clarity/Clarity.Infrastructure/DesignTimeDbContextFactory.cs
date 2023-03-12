// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Microsoft.Extensions.DependencyInjection;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ClarityDbContext>
{
    public ClarityDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<ClarityDbContext>();

        builder.UseSqlServer("Data Source=(LocalDb)\\MSSQLLocalDB;Initial Catalog=Clarity;Integrated Security=SSPI;");

        return new ClarityDbContext(builder.Options);
    }
}