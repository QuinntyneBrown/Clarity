using Clarity.Core.Data;
using Clarity.Core.Models;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Clarity.Core.Extensions;
using Clarity.Core.Identity;

namespace Clarity.Domain
{
    public static class SeedData
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {
            StateConfiguration.Seed(context, configuration);
            //TeamMemberConfiguration.Seed(context, configuration);
            //UserConfiguration.Seed(context, configuration);
        }
    }

    internal class StateConfiguration
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {
            var order = 0;

            new string[12] { 
                "Backlog", 
                "Analysis",
                "Analysis Done", 
                "Selected", 
                "Research", 
                "UX", 
                "Read for Dev", 
                "In Progress", 
                "QA Ready", 
                "Testing", 
                "Deployment", 
                "Done" 
            }.ForEach(name => {
                if (context.States.SingleOrDefault(x => x.Name == name) == null)
                    context.States.Add(new State
                    {
                        Name = name,
                        Order = order
                    });                
            });

            context.SaveChanges();
        }
    }

    internal class TeamMemberConfiguration
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {
            new TeamMember[3] {
                new TeamMember { Name = "Quinntyne" },
                new TeamMember { Name = "Vanessa" },
                new TeamMember { Name = "Patrick" }
            }.ForEach(teamMember => {
                if (context.TeamMembers.SingleOrDefault(x => x.Name == teamMember.Name) == null)
                    context.TeamMembers.Add(teamMember);
            });
        }
    }

    internal class UserConfiguration
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {
            new User[3] {
                new User { Username = "Quinntyne" },
                new User { Username = "Vanessa" },
                new User { Username = "Patrick" }
            }.ForEach(user => {
                if (context.Users.SingleOrDefault(x => x.Username == user.Username) == null)
                {
                    user.Password = new PasswordHasher().HashPassword(user.Salt, "P@ssw0rd");
                    context.Users.Add(user);
                }
            });
        }
    }
}

