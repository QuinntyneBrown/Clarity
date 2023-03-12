using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardStateAggregate.Queries;

 public class GetBoardStates
 {
     public class Request : IRequest<Response> { }
     public class Response
     {
         public IEnumerable<BoardStateDto> States { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly IClarityDbContext _context;
         public Handler(IClarityDbContext context) => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
             => new()
             {
                 States = await _context.BoardStates
                 .Include(x => x.TicketStates)
                 .ThenInclude(x => x.Ticket)
                 .Select(x => x.ToDto()).ToListAsync()
             };
     }
 }
