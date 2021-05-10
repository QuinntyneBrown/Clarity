using MediatR;
using System.Collections.Generic;

namespace BuildingBlocks.EventStore
{
    public class EventStoreChanged : INotification
    {
        public IEnumerable<StoredEvent> Events { get; set; }
    }
}
