using Clarity.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.Data
{
    public interface IClarityContext
    {
        DbSet<Board> Boards { get; }
        DbSet<Comment> Comments { get; }
        DbSet<DigitalAsset> DigitalAssets { get; }
        DbSet<BoardState> BoardStates { get; }
        DbSet<TeamMember> TeamMembers { get; }
        DbSet<Ticket> Tickets { get; }
        DbSet<User> Users { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
