// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging;

public interface IServiceBusMessage
{
    public IDictionary<string, string> MessageAttributes { get; init; }
    public string Body { get; init; }
}

