using System;

namespace BuildingBlocks.EventStore
{
    public interface ICorrelationIdAccessor
    {
        Guid CorrelationId { get; }
    }
}
