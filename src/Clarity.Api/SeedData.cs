using Clarity.Core.Data;
using Clarity.Core.Models;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Clarity.Api
{
    public static class SeedData
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {
            StateConfiguration.Seed(context, configuration);
        }
    }

    internal class StateConfiguration
    {
        public static void Seed(ClarityContext context, IConfiguration configuration)
        {

            AddStateIfDoesntExist(context, "Backlog", 0);
            AddStateIfDoesntExist(context, "Analysis", 1);
            AddStateIfDoesntExist(context, "Analysis Done", 2);
            AddStateIfDoesntExist(context, "Selected", 3);
            AddStateIfDoesntExist(context, "Research", 4);
            AddStateIfDoesntExist(context, "UX", 5);
            AddStateIfDoesntExist(context, "Ready for Dev", 6);
            AddStateIfDoesntExist(context, "In Progress", 7);
            AddStateIfDoesntExist(context, "QA Ready", 8);
            AddStateIfDoesntExist(context, "Testing", 9);
            AddStateIfDoesntExist(context, "Deployment", 10);
            AddStateIfDoesntExist(context, "Done", 11);

            void AddStateIfDoesntExist (ClarityContext context, string name, int order)
            {
                if (context.States.SingleOrDefault(x => x.Name == name) == null)
                {
                    context.States.Add(new State
                    {
                        Name = name,
                        Order = order
                    });
                }
            }
            context.SaveChanges();
        }
    }
}

