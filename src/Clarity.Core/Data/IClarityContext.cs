using Clarity.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.Data
{
    public interface IClarityContext
    {
        DbSet<Ticket> Tickets { get; }
        DbSet<State> States { get; }
    }
}
