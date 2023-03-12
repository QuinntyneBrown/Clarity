// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Messaging;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Telemetry;

public class TelemetryProducer : BackgroundService
{
    private readonly ILogger<TelemetryProducer> _logger;
    private readonly IServiceBusMessageSender _serviceBusMessageSender;

    public TelemetryProducer(
        ILogger<TelemetryProducer> logger,
        IServiceBusMessageSender serviceBusMessageSender)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _serviceBusMessageSender = serviceBusMessageSender ?? throw new ArgumentNullException(nameof(serviceBusMessageSender));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            await _serviceBusMessageSender.Send(new TelemetryMessage());

            await Task.Delay(300, stoppingToken);
        }
    }
}