using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static Newtonsoft.Json.JsonConvert;
using static System.Runtime.Serialization.FormatterServices;

namespace BuildingBlocks.EventStore
{
    public class EventStore : DbContext, IEventStore
    {
        private readonly IDateTime _dateTime;
        private readonly ICorrelationIdAccessor _correlationIdAccessor;
        private readonly IMediator _meditator;


        protected readonly List<IAggregateRoot> _trackedAggregates = new List<IAggregateRoot>();
        protected List<IAggregateRoot> TrackedAggregates { get; }
        public EventStore(DbContextOptions<EventStore> options,IDateTime dateTime, ICorrelationIdAccessor correlationIdAccessor, IMediator mediator)
            : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            _dateTime = dateTime;
            _correlationIdAccessor = correlationIdAccessor;
            _meditator = mediator;
        }

        public DbSet<StoredEvent> StoredEvents { get; protected set; }

        public override ValueTask<TEntity> FindAsync<TEntity>(params object[] keyValues)
        {
            var entityType = typeof(TEntity);

            var streamId = new Guid($"{keyValues[0]}");

            var events = StoredEvents.Where(x => x.StreamId == streamId).OrderBy(x => x.CreatedOn).ToList()
                    .Select(x => DeserializeObject(x.Data, Type.GetType(x.DotNetType)) as IEvent);

            if (!events.Any())
                return default;

            var aggregate = events.Aggregate(GetUninitializedObject(entityType) as IAggregateRoot, (x, y) => x.Apply(y));

            aggregate.ClearChanges();

            _trackedAggregates.Add(aggregate);

            return new ValueTask<TEntity>(Task.FromResult(aggregate as TEntity));
        }

        public void Add(IAggregateRoot aggregateRoot) => _trackedAggregates.Add(aggregateRoot);

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            foreach (var aggregateRoot in _trackedAggregates)
            {
                var type = aggregateRoot.GetType();

                var storedEvents = aggregateRoot.DomainEvents
                    .Select(@event =>
                    {
                        var type = aggregateRoot.GetType();

                        var storedEvent = new StoredEvent
                        {
                            StoredEventId = Guid.NewGuid(),
                            Aggregate = aggregateRoot.GetType().Name,
                            AggregateDotNetType = aggregateRoot.GetType().AssemblyQualifiedName,
                            Data = SerializeObject(@event),
                            StreamId = (Guid)type.GetProperty($"{type.Name}Id").GetValue(aggregateRoot, null),
                            DotNetType = @event.GetType().AssemblyQualifiedName,
                            Type = @event.GetType().Name,
                            CreatedOn = @event.Created,
                            CorrelationId = _correlationIdAccessor.CorrelationId
                        };

                        return storedEvent;
                    });

                await _meditator?.Publish(new EventStoreChanged { Events = storedEvents });

                StoredEvents.AddRange(storedEvents);
            }

            _trackedAggregates.Clear();

            return await base.SaveChangesAsync(cancellationToken);
        }
    }

}
