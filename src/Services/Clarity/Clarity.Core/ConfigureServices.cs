// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddCoreServices(this IServiceCollection services, IWebHostEnvironment environment, IConfiguration configuration)
    {
        services.AddMediatR(x => x.RegisterServicesFromAssemblyContaining<IClarityDbContext>());

        services.AddValidation(typeof(IClarityDbContext));

        services.AddSecurity(environment, configuration);

        services.AddMessagingUdpServices();

        services.AddTelemetryServices();

        services.AddHostedService<ServiceBusMessageConsumer>();

    }
}


