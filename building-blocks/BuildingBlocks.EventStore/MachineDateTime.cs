using BuildingBlocks.EventStore;
using System;

namespace BuildingBlocks.EventStore
{
    public class MachineDateTime : IDateTime
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}
