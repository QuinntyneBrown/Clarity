using System;

namespace BuildingBlocks.EventStore
{
    public interface IDateTime
    {
        System.DateTime UtcNow { get; }
    }
}
