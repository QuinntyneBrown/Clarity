using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Queries;

 public class GetBoardsRequest : IRequest<GetBoardsResponse> { }

 public class GetBoardsResponse
 {
     public ICollection<BoardDto> Boards { get; set; }
 }

  public class GetBoardsRequestHandler : IRequestHandler<GetBoardsRequest, GetBoardsResponse>
 {
     public IClarityDbContext _context { get; set; }
      public GetBoardsRequestHandler(IClarityDbContext context) => _context = context;
     public async Task<GetBoardsResponse> Handle(GetBoardsRequest request, CancellationToken cancellationToken)
         => new()
         {
             Boards = await _context.Boards
             .Include(x => x.BoardStates)
             .Select(x => x.ToDto())
             .ToListAsync()
         };
 }

