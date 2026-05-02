// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class RemoveDigitalAssetRequest : IRequest<RemoveDigitalAssetResponse>
{
    public Guid DigitalAssetId { get; set; }
}

public class RemoveDigitalAssetResponse
{
}

public class RemoveDigitalAssetHandler : IRequestHandler<RemoveDigitalAssetRequest, RemoveDigitalAssetResponse>
{
    private readonly IClarityDbContext _context;

    public RemoveDigitalAssetHandler(IClarityDbContext context) => _context = context;

    public async Task<RemoveDigitalAssetResponse> Handle(RemoveDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAssetId);
        if (digitalAsset != null)
        {
            _context.DigitalAssets.Remove(digitalAsset);
            await _context.SaveChangesAsync(cancellationToken);
        }
        return new();
    }
}
