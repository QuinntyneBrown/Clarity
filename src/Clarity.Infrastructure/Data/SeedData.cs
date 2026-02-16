// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.UserAggregate;
using Security;

namespace Clarity.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(this ClarityDbContext context)
    {
        var defaultBoard = context.Boards.FirstOrDefault(x => x.Name == "Default");

        if (defaultBoard == null)
        {
            context.Boards.Add(Board.WithDefaults("Default"));
            context.SaveChanges();
        }

        var defaultTeamMember = context.TeamMembers.FirstOrDefault(x => x.Name == "Quinntyne");

        if (defaultTeamMember == null)
        {
            context.TeamMembers.Add(new TeamMember("Quinntyne"));
            context.SaveChanges();
        }

        if (context.Users.SingleOrDefault(x => x.Username == "quinntynebrown@gmail.com") == null)
        {
            var passwordHasher = new PasswordHasher();
            context.Users.Add(new User("quinntynebrown@gmail.com", "P@ssw0rd", passwordHasher));
            context.SaveChanges();
        }
    }
}
