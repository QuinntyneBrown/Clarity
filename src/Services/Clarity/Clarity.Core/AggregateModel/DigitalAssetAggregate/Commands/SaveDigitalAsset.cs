using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class SaveDigitalAssetRequest : IRequest<SaveDigitalAssetResponse>
{
    public DigitalAssetDto DigitalAsset { get; set; }
}

public class SaveDigitalAssetResponse
{
    public Guid DigitalAssetId { get; set; }
}

public class SaveDigitalAssetHandler : IRequestHandler<SaveDigitalAssetRequest, SaveDigitalAssetResponse>
{
    public IClarityDbContext _context { get; set; }

    public SaveDigitalAssetHandler(IClarityDbContext context) => _context = context;

    public async Task<SaveDigitalAssetResponse> Handle(SaveDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAsset.DigitalAssetId);

        if (digitalAsset == null) _context.DigitalAssets.Add(digitalAsset = new DigitalAsset(request.DigitalAsset.Name));

        await _context.SaveChangesAsync(cancellationToken);

        return new() { DigitalAssetId = digitalAsset.DigitalAssetId };
    }
}
