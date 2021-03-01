using System;
using System.Collections.Generic;

namespace BuildingBlocks.EventStore
{
    public class SnapShot
    {
        public Guid SnapShotId { get; init; }
        public DateTime Created { get; init; } = DateTime.UtcNow;
        public IDictionary<string, HashSet<AggregateRoot>> Data { get; init; }
        = new Dictionary<string, HashSet<AggregateRoot>>();
    }
}
