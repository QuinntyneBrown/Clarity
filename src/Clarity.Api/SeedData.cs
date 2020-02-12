using Clarity.Core.Data;
using Clarity.Core.Models;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Clarity.Core.Extensions;

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
            }.ForEach(name => AddStateIfDoesntExist(context, name, order++));

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

