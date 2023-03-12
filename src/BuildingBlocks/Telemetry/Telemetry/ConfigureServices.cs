// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Telemetry;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddTelemetryServices(this IServiceCollection services)
    {
        services.AddHostedService<TelemetryProducer>();
    }
}