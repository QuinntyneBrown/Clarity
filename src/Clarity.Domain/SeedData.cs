using BuildingBlocks.Core;
using Clarity.Core.Data;
using Clarity.Core.Models;
using System;
using System.Linq;

namespace Clarity.Domain
{
    public static class SeedData
    {
        public static void Seed(ClarityContext context)
        {
            BoardConfiguration.Seed(context);
            StateConfiguration.Seed(context);
            TeamMemberConfiguration.Seed(context);
            UserConfiguration.Seed(context);
        }
    }

    internal class BoardConfiguration
    {
        public static void Seed(ClarityContext context)
        {
            new string[1] {
                "Default",
            }.ForEach(name =>
            {
                if (context.Boards.SingleOrDefault(x => x.Name == name) == null)
                    context.Boards.Add(new(name));
            });

            context.SaveChanges();
        }
    }

    internal class StateConfiguration
    {
        public static void Seed(ClarityContext context)
        {
            var order = 0;

            Enum.GetValues<StateType>().ForEach(type =>
            {
                if (context.BoardStates.SingleOrDefault(x => x.Type == type) == null)
                    context.BoardStates.Add(new (type, order++, 1));
            });

            context.SaveChanges();
        }
    }

    internal class TeamMemberConfiguration
    {
        public static void Seed(ClarityContext context)
        {
            new TeamMember[1] {
                new ("Quinntyne"),
            }.ForEach(teamMember =>
            {
                if (context.TeamMembers.SingleOrDefault(x => x.Name == teamMember.Name) == null)
                    context.TeamMembers.Add(teamMember);
            });

            context.SaveChanges();
        }
    }

    internal class UserConfiguration
    {
        public static void Seed(ClarityContext context)
        {
            new User[1] {
                new ("Quinntyne")
            }.ForEach(user =>
            {
                if (context.Users.SingleOrDefault(x => x.Username == user.Username) == null)
                {
                    context.Users.Add(user.SetPassword("P@ssw0rd"));
                }
            });

            context.SaveChanges();
        }
    }
}

