using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Queries;

public class GetTicketsByBoardIdRequest : IRequest<GetTicketsByBoardIdResponse>
{
    public Guid BoardId { get; set; }
}

public class GetTicketsByBoardIdResponse
{
    public IEnumerable<TicketDto> Tickets { get; set; }
}

public class GetTicketsByBoardIdRequestHandler : IRequestHandler<GetTicketsByBoardIdRequest, GetTicketsByBoardIdResponse>
{
    public IClarityDbContext _context { get; set; }

    public GetTicketsByBoardIdRequestHandler(IClarityDbContext context) => _context = context;
    
    public async Task<GetTicketsByBoardIdResponse> Handle(GetTicketsByBoardIdRequest request, CancellationToken cancellationToken)
        => new()
        {
            Tickets = await _context.Tickets
            .Include(x => x.Comments)
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .Where(x => x.TicketStates.OrderByDescending(ts => ts.Created).First().BoardState.BoardId == request.BoardId)
            .Select(x => x.ToDto())
            .ToListAsync()
        };
}

