using MediatR;
using System.Threading.Tasks;
using System.Threading;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class RemoveDigitalAssetRequest : IRequest<RemoveDigitalAssetResponse>
{
    public int DigitalAssetId { get; set; }
}

public class RemoveDigitalAssetResponse
{
}

public class RemoveDigitalAssetHandler : IRequestHandler<RemoveDigitalAssetRequest, RemoveDigitalAssetResponse>
{
    public IClarityDbContext _context { get; set; }
    public RemoveDigitalAssetHandler(IClarityDbContext context) => _context = context;
    public async Task<RemoveDigitalAssetResponse> Handle(RemoveDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        _context.DigitalAssets.Remove(await _context.DigitalAssets.FindAsync(request.DigitalAssetId));
        await _context.SaveChangesAsync(cancellationToken);
        return new();
    }
}
