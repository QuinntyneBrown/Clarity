using Clarity.Core.Models;
using Clarity.Core.Data;
using Microsoft.EntityFrameworkCore;
using Clarity.Domain;

namespace Clarity.Testing.Builders
{
    public class ClarityContextBuilder
    {
        private ClarityContext _clarityContext;

        public static ClarityContext WithDefaults(string databaseName)
        {
            var dbContextOptions = new DbContextOptionsBuilder()
                .UseInMemoryDatabase(databaseName)
                .Options;

            var context = new ClarityContext(dbContextOptions);

            SeedData.Seed(context);

            context.ChangeTracker.Clear();

            return context;
        }

        public ClarityContextBuilder(string databaseName)
        {
            _clarityContext = WithDefaults(databaseName);
        }

        public ClarityContext Build()
        {
            return _clarityContext;
        }
    }
}
