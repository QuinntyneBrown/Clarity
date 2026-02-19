// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Queries;

public class GetTicketByIdRequest : IRequest<GetTicketByIdResponse>
{
    public Guid TicketId { get; set; }
}

public class GetTicketByIdResponse
{
    public TicketDto Ticket { get; set; }
}

public class GetTicketByIdRequestHandler : IRequestHandler<GetTicketByIdRequest, GetTicketByIdResponse>
{
    private readonly IClarityDbContext _context;
    public GetTicketByIdRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetTicketByIdResponse> Handle(GetTicketByIdRequest request, CancellationToken cancellationToken)
        => new()
        {
            Ticket = (await _context.Tickets
            .Include(x => x.TeamMember)
            .Include(x => x.Initiative)
            .Include(x => x.Comments)
            .ThenInclude(x => x.TeamMember)
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .Include(x => x.DigitalAssets)
            .FirstOrDefaultAsync(x => x.TicketId == request.TicketId))?.ToDto()
        };
}
