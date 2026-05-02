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

        var emailTeamMember = context.TeamMembers.FirstOrDefault(x => x.Name == "quinntynebrown@gmail.com");

        if (emailTeamMember == null)
        {
            context.TeamMembers.Add(new TeamMember("quinntynebrown@gmail.com"));
            context.SaveChanges();
        }

        var existingUser = context.Users.SingleOrDefault(x => x.Username == "quinntynebrown@gmail.com");

        if (existingUser == null)
        {
            var passwordHasher = new PasswordHasher();
            var user = new User("quinntynebrown@gmail.com", "P@ssw0rd", passwordHasher)
            {
                FirstName = "Quinntyne",
                LastName = "Brown",
                Email = "quinntynebrown@gmail.com",
                JobTitle = "Software Engineer"
            };
            context.Users.Add(user);
            context.SaveChanges();
        }
        else if (string.IsNullOrEmpty(existingUser.FirstName))
        {
            existingUser.FirstName = "Quinntyne";
            existingUser.LastName = "Brown";
            existingUser.Email = "quinntynebrown@gmail.com";
            existingUser.JobTitle = "Software Engineer";
            context.SaveChanges();
        }
    }
}
