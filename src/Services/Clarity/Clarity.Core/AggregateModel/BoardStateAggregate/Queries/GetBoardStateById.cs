using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardStateAggregate.Queries;

 public class GetBoardStateById
 {
     public class Request : IRequest<Response>
     {
         public int StateId { get; set; }
     }
     public class Response
     {
         public BoardStateDto State { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly IClarityDbContext _context;
         public Handler(IClarityDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
             => new()
             {
                 State = (await _context.BoardStates.FindAsync(request.StateId)).ToDto()
             };
     }
 }
