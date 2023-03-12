using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardStateAggregate.Queries;

public class GetBoardStatesRequest : IRequest<GetBoardStatesResponse> { }

public class GetBoardStatesResponse
{
    public IEnumerable<BoardStateDto> States { get; set; }
}
 
public class GetBoardStatesRequestHandler : IRequestHandler<GetBoardStatesRequest, GetBoardStatesResponse>
{
    private readonly IClarityDbContext _context;
    public GetBoardStatesRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetBoardStatesResponse> Handle(GetBoardStatesRequest request, CancellationToken cancellationToken)
        => new()
        {
            States = await _context.BoardStates
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.Ticket)
            .Select(x => x.ToDto()).ToListAsync()
        };
}
