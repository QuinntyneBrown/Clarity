using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardStateAggregate.Queries;

 public class GetBoardStateByIdRequest : IRequest<GetBoardStateByIdResponse>
 {
     public int StateId { get; set; }
 }

 public class GetBoardStateByIdResponse
 {
     public BoardStateDto State { get; set; }
 }

 public class GetBoardStateByIdRequestHandler : IRequestHandler<GetBoardStateByIdRequest, GetBoardStateByIdResponse>
 {
     private readonly IClarityDbContext _context;
      public GetBoardStateByIdRequestHandler(IClarityDbContext context)
         => _context = context;
     public async Task<GetBoardStateByIdResponse> Handle(GetBoardStateByIdRequest request, CancellationToken cancellationToken)
         => new()
         {
             State = (await _context.BoardStates.FindAsync(request.StateId)).ToDto()
         };
 }
 
