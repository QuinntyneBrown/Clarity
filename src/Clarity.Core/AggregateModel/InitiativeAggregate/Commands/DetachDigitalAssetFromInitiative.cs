// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Commands;

public class DetachDigitalAssetFromInitiativeRequest : IRequest<DetachDigitalAssetFromInitiativeResponse>
{
    public Guid InitiativeId { get; set; }
    public Guid DigitalAssetId { get; set; }
}

public class DetachDigitalAssetFromInitiativeResponse { }

public class DetachDigitalAssetFromInitiativeHandler : IRequestHandler<DetachDigitalAssetFromInitiativeRequest, DetachDigitalAssetFromInitiativeResponse>
{
    private readonly IClarityDbContext _context;

    public DetachDigitalAssetFromInitiativeHandler(IClarityDbContext context) => _context = context;

    public async Task<DetachDigitalAssetFromInitiativeResponse> Handle(DetachDigitalAssetFromInitiativeRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives
            .Include(i => i.DigitalAssets)
            .FirstOrDefaultAsync(i => i.InitiativeId == request.InitiativeId, cancellationToken);

        if (initiative != null)
        {
            var asset = initiative.DigitalAssets.FirstOrDefault(a => a.DigitalAssetId == request.DigitalAssetId);
            if (asset != null)
            {
                initiative.DigitalAssets.Remove(asset);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return new();
    }
}
