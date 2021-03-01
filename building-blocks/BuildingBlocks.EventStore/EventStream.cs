using System;
using System.Collections.Generic;

namespace BuildingBlocks.EventStore
{
    public class EventStream
    {
        public Guid EventStreamId { get; set; }
        public List<object> Events { get; set; }
        public int Version { get; set; }
    }
}
