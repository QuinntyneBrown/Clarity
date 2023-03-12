using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Queries;

 public class GetBoardByNameRequest : IRequest<GetBoardByNameResponse>
 {
     public string Name { get; set; }
 }

 public class GetBoardByNameResponse
 {
     public BoardDto Board { get; set; }
 }

 public class GetBoardByNameRequestHandler : IRequestHandler<GetBoardByNameRequest, GetBoardByNameResponse>
 {
     public IClarityDbContext _context { get; set; }
      public GetBoardByNameRequestHandler(IClarityDbContext context) => _context = context;
     public async Task<GetBoardByNameResponse> Handle(GetBoardByNameRequest request, CancellationToken cancellationToken)
         => new()
         {
             Board = (await _context.Boards
             .Include(x => x.BoardStates)
             .FirstOrDefaultAsync(x => x.Name == request.Name)).ToDto()
         };
 }
