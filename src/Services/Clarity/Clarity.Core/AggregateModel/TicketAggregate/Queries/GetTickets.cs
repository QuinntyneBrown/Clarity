using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Queries;


public class GetTicketsRequest : IRequest<GetTicketsResponse> { }

public class GetTicketsResponse
{
    public IEnumerable<TicketDto> Tickets { get; set; }
}

public class GetTicketsRequestHandler : IRequestHandler<GetTicketsRequest, GetTicketsResponse>
{
    private readonly IClarityDbContext _context;

    public GetTicketsRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<GetTicketsResponse> Handle(GetTicketsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Tickets = await _context.Tickets
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .Select(x => x.ToDto())
            .ToListAsync()
        };
    }
}

