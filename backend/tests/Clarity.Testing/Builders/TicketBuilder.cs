// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TicketAggregate;

namespace Clarity.Testing.Builders;

public class TicketBuilder
{
    private Ticket _ticket;

    public static Ticket WithDefaults()
    {
        return new Ticket(default, default, default, default, default);
    }

    public TicketBuilder()
    {
        _ticket = WithDefaults();
    }

    public Ticket Build()
    {
        return _ticket;
    }
}

