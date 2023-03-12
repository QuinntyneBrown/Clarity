using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Queries;


 public class GetBoardByIdRequest : IRequest<GetBoardByIdResponse>
 {
     public Guid BoardId { get; set; }
 }

 public class GetBoardByIdResponse
 {
     public BoardDto Board { get; set; }
 }

  public class GetBoardByIdRequestHandler : IRequestHandler<GetBoardByIdRequest, GetBoardByIdResponse>
 {
     public IClarityDbContext _context { get; set; }
      public GetBoardByIdRequestHandler(IClarityDbContext context) => _context = context;
     public async Task<GetBoardByIdResponse> Handle(GetBoardByIdRequest request, CancellationToken cancellationToken)
         => new()
         {
             Board = (await _context.Boards
             .Include(x => x.BoardStates)
             .FirstOrDefaultAsync(x => x.BoardId == request.BoardId)).ToDto()
         };
 }

