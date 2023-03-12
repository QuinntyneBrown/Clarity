// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging.Internals;
using Microsoft.Extensions.Logging;
using System.Net.Sockets;

namespace Messaging.Udp;

public class ServiceBusMessageListener : Observable<IServiceBusMessage>, IServiceBusMessageListener
{
    private readonly ILogger<ServiceBusMessageListener> _logger;
    private readonly UdpClient _client;

    public ServiceBusMessageListener(
        ILogger<ServiceBusMessageListener> logger,
        IUdpClientFactory udpClientFactory
        )
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _client = udpClientFactory.Create();
    }

    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var result = await _client.ReceiveAsync(cancellationToken);

            var json = System.Text.Encoding.UTF8.GetString(result.Buffer);

            var serviceBusMessage = System.Text.Json.JsonSerializer.Deserialize<IServiceBusMessage>(json)!;

            Broadcast(serviceBusMessage);

            await Task.Delay(300);
        }
    }
}


