// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Messaging;
using Messaging.Udp;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static System.Text.Json.JsonSerializer;

namespace Clarity.Core;

public class ServiceBusMessageConsumer : BackgroundService
{
    private readonly ILogger<ServiceBusMessageConsumer> _logger;
    private readonly IUdpClientFactory _udpClientFactory;
    private readonly IMediator _mediator;
    private readonly string[] _supportedMessageTypes = new string[] { };

    public ServiceBusMessageConsumer(
        ILogger<ServiceBusMessageConsumer> logger,
        IUdpClientFactory udpClientFactory,
        IMediator mediator)
    {

        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _udpClientFactory = udpClientFactory ?? throw new ArgumentNullException(nameof(udpClientFactory));
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var client = _udpClientFactory.Create();

        while (!stoppingToken.IsCancellationRequested)
        {
            var result = await client.ReceiveAsync(stoppingToken);

            var json = Encoding.UTF8.GetString(result.Buffer);

            var message = Deserialize<ServiceBusMessage>(json)!;

            var messageType = message.MessageAttributes["MessageType"];

            if (_supportedMessageTypes.Contains(messageType))
            {
                var type = Type.GetType($"Clarity.Core.Messages.{messageType}");

                var request = (IRequest)Deserialize(message.Body, type!)!;

                await _mediator.Send(request, stoppingToken);
            }

            await Task.Delay(300);
        }
    }
}