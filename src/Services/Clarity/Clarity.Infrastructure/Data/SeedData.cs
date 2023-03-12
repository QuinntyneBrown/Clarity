// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate;

namespace Clarity.Infrastructure.Data;

public static class SeedData { 

    public static void Seed(this ClarityDbContext context)
    {
        var defaultBoard = context.Boards.FirstOrDefault(x => x.Name == "Default");
        
        if(defaultBoard != null)
        {
            context.Remove(defaultBoard);
            context.SaveChanges();
        }

        context.Boards.Add(Board.WithDefaults("Default"));

        context.SaveChanges();
    }

}

