using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace BuildingBlocks.EventStore
{
    public interface IEventStore
    {
        DbSet<StoredEvent> StoredEvents { get; }
        void Add(IAggregateRoot aggregateRoot);
        ValueTask<TEntity> FindAsync<TEntity>(params object[] keyValues) where TEntity : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
