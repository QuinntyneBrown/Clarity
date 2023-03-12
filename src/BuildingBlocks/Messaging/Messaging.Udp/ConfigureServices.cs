// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging;
using Messaging.Udp;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{

    public static void AddMessagingUdpServices(this IServiceCollection services)
    {
        services.AddSingleton<IServiceBusMessageSender, ServiceBusMessageSender>();
        services.AddSingleton<IServiceBusMessageListener, ServiceBusMessageListener>();
        services.AddSingleton<IUdpClientFactory, UdpClientFactory>();
    }
}