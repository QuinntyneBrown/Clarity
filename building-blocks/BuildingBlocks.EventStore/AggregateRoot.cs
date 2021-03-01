using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Runtime.Serialization.FormatterServices;

namespace BuildingBlocks.EventStore
{
    public abstract class AggregateRoot : IAggregateRoot
    {
        internal List<IEvent> _events = new List<IEvent>();

        [NotMapped]
        public IReadOnlyCollection<IEvent> DomainEvents => _events.AsReadOnly();

        public AggregateRoot(IEnumerable<IEvent> events)
        {
            foreach (var @event in events) { When(@event); }
        }

        protected AggregateRoot()
        {

        }

        public void RaiseDomainEvent(IEvent @event)
        {
            _events ??= new List<IEvent>();
            _events.Add(@event);
        }
        public void ClearChanges() => _events?.Clear();
        public AggregateRoot Apply(IEvent @event)
        {
            When(@event);
            EnsureValidState();
            RaiseDomainEvent(@event);
            return this;
        }
        protected abstract void When(dynamic @event);
        protected abstract void EnsureValidState();

        public static TAggregateRoot Create<TAggregateRoot>()
            => (TAggregateRoot)GetUninitializedObject(typeof(TAggregateRoot));

    }
}
