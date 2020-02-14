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
        DbSet<Note> Notes { get; }
        DbSet<TeamMember> TeamMembers { get; }
        DbSet<User> Users { get; }
        DbSet<DigitalAsset> DigitalAssets { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
