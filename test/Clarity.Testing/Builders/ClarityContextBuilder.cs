// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Testing.Builders;

public class ClarityDbContextBuilder
{
    private ClarityDbContext _ClarityDbContext;

    public static ClarityDbContext WithDefaults(string databaseName)
    {
        var dbContextOptions = new DbContextOptionsBuilder()
            .UseInMemoryDatabase(databaseName)
            .Options;

        var context = new ClarityDbContext(dbContextOptions);
        
        SeedData.Seed(context);
        
        context.ChangeTracker.Clear();
        
        return context;
    }

    public ClarityDbContextBuilder(string databaseName)
    {
        _ClarityDbContext = WithDefaults(databaseName);
    }

    public ClarityDbContext Build()
    {
        return _ClarityDbContext;
    }
}

