// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging;

public interface IServiceBusMessageListener : IObservable<IServiceBusMessage>
{
    Task StartAsync(CancellationToken cancellationToken = default);
}