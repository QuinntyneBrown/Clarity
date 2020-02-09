using Clarity.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.Data
{
    public class ClarityContext: DbContext, IClarityContext
    {
        public ClarityContext(DbContextOptions options)
            : base(options) { }


        public DbSet<Ticket> Tickets { get; private set; }
        public DbSet<State> States { get; private set; }
    }

}
