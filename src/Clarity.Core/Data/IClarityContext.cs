using Clarity.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.Data
{
    public interface IClarityContext
    {
        DbSet<Ticket> Tickets { get; }
        DbSet<State> States { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
