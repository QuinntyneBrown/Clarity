// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel;

namespace Clarity.Testing.Builders;

public class TicketDtoBuilder
{
    private TicketDto _ticketDto;

    public static TicketDto WithDefaults()
    {
        return new TicketDto();
    }

    public TicketDtoBuilder()
    {
        _ticketDto = WithDefaults();
    }

    public TicketDto Build()
    {
        return _ticketDto;
    }
}

