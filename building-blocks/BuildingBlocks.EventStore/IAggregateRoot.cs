using System.Collections.Generic;

namespace BuildingBlocks.EventStore
{
    public interface IAggregateRoot
    {
        AggregateRoot Apply(IEvent @event);
        void ClearChanges();
        IReadOnlyCollection<IEvent> DomainEvents { get; }
    }
}
