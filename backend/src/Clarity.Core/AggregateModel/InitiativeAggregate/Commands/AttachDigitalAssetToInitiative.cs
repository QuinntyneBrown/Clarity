// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Commands;

public class AttachDigitalAssetToInitiativeRequest : IRequest<AttachDigitalAssetToInitiativeResponse>
{
    public Guid InitiativeId { get; set; }
    public Guid DigitalAssetId { get; set; }
}

public class AttachDigitalAssetToInitiativeResponse { }

public class AttachDigitalAssetToInitiativeHandler : IRequestHandler<AttachDigitalAssetToInitiativeRequest, AttachDigitalAssetToInitiativeResponse>
{
    private readonly IClarityDbContext _context;

    public AttachDigitalAssetToInitiativeHandler(IClarityDbContext context) => _context = context;

    public async Task<AttachDigitalAssetToInitiativeResponse> Handle(AttachDigitalAssetToInitiativeRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives
            .Include(i => i.DigitalAssets)
            .FirstOrDefaultAsync(i => i.InitiativeId == request.InitiativeId, cancellationToken);

        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAssetId);

        if (initiative != null && digitalAsset != null)
        {
            initiative.DigitalAssets.Add(digitalAsset);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new();
    }
}
