using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Queries;

 public class GetBoardByName
 {
     public class Request : IRequest<Response>
     {
         public string Name { get; set; }
     }
     public class Response
     {
         public BoardDto Board { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         public IClarityDbContext _context { get; set; }
         public Handler(IClarityDbContext context) => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
             => new()
             {
                 Board = (await _context.Boards
                 .Include(x => x.BoardStates)
                 .FirstOrDefaultAsync(x => x.Name == request.Name)).ToDto()
             };
     }
 }
