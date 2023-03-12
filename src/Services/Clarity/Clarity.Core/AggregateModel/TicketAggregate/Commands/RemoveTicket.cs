using Kernel;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

 public class RemoveTicket
 {
     public class Request : IRequest<Response>
     {
         public int TicketId { get; set; }
     }
     public class Response : ResponseBase { }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly IClarityDbContext _context;
         public Handler(IClarityDbContext context) => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var ticket = await _context.Tickets.FindAsync(request.TicketId);
             _context.Tickets.Remove(ticket);
             await _context.SaveChangesAsync(cancellationToken);
             return new();
         }
     }
 }
