using MediatR;
using System.Threading.Tasks;
using System.Threading;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

 public class RemoveDigitalAsset
 {
     public class Request : IRequest<Response>
     {
         public int DigitalAssetId { get; set; }
     }
     public class Response
     {
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         public IClarityDbContext _context { get; set; }
         public Handler(IClarityDbContext context) => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             _context.DigitalAssets.Remove(await _context.DigitalAssets.FindAsync(request.DigitalAssetId));
             await _context.SaveChangesAsync(cancellationToken);
             return new();
         }
     }
 }
