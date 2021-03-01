using Microsoft.Extensions.DependencyInjection;

namespace BuildingBlocks.EventStore
{
    public static class ServiceCollectionExtensions
    {
        public static void AddEventStore(this IServiceCollection services)
        {
            services.AddTransient<IEventStore, EventStore>();
            services.AddSingleton<IDateTime, MachineDateTime>();
            services.AddTransient<ICorrelationIdAccessor, CorrelationIdAccessor>();
        }
    }
}
