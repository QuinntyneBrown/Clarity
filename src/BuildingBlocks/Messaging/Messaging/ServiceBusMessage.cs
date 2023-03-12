// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging;

public class ServiceBusMessage : IServiceBusMessage
{

    public ServiceBusMessage(IDictionary<string, string> messageAttributes, string body)
    {
        MessageAttributes = messageAttributes;
        Body = body;
    }

    public IDictionary<string, string> MessageAttributes { get; init; }
    public string Body { get; init; }
}