using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Queries;

public class GetTicketByNameRequest : IRequest<GetTicketByNameResponse>
{
    public string Name { get; set; }
}

public class GetTicketByNameResponse
{
    public TicketDto Ticket { get; set; }
}

public class GetTicketByNameRequestHandler : IRequestHandler<GetTicketByNameRequest, GetTicketByNameResponse>
{
    private readonly IClarityDbContext _context;
    public GetTicketByNameRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetTicketByNameResponse> Handle(GetTicketByNameRequest request, CancellationToken cancellationToken)
        => new()
        {
            Ticket = (await _context.Tickets
            .Include(x => x.Comments)
            .ThenInclude(x => x.TeamMember)
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .FirstOrDefaultAsync(x => x.Name == request.Name))?.ToDto()
        };
}

