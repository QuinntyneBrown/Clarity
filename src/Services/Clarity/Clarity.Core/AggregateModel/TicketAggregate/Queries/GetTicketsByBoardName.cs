using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Queries;

public class GetTicketsByBoardNameRequest : IRequest<GetTicketsByBoardNameResponse>
{
    public string Name { get; set; }
}

public class GetTicketsByBoardNameResponse
{
    public IEnumerable<TicketDto> Tickets { get; set; }
}

public class GetTicketsByBoardNameRequestHandler : IRequestHandler<GetTicketsByBoardNameRequest, GetTicketsByBoardNameResponse>
{
    public IClarityDbContext _context { get; set; }
    public GetTicketsByBoardNameRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetTicketsByBoardNameResponse> Handle(GetTicketsByBoardNameRequest request, CancellationToken cancellationToken)
        => new()
        {
            Tickets = await _context.Tickets
            .Include(x => x.Comments)
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .ThenInclude(x => x.Board)
            .Where(x => x.TicketStates.OrderByDescending(ts => ts.Created).First().BoardState.Board.Name == request.Name)
            .Select(x => x.ToDto())
            .ToListAsync()
        };
}

