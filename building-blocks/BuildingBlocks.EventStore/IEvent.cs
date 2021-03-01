using System;

namespace BuildingBlocks.EventStore
{
    public interface IEvent
    {
        DateTime Created { get; set; }
    }
}
