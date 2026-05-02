// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

public class AttachDigitalAssetToTicketRequest : IRequest<AttachDigitalAssetToTicketResponse>
{
    public Guid TicketId { get; set; }
    public Guid DigitalAssetId { get; set; }
}

public class AttachDigitalAssetToTicketResponse { }

public class AttachDigitalAssetToTicketHandler : IRequestHandler<AttachDigitalAssetToTicketRequest, AttachDigitalAssetToTicketResponse>
{
    private readonly IClarityDbContext _context;

    public AttachDigitalAssetToTicketHandler(IClarityDbContext context) => _context = context;

    public async Task<AttachDigitalAssetToTicketResponse> Handle(AttachDigitalAssetToTicketRequest request, CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets
            .Include(t => t.DigitalAssets)
            .FirstOrDefaultAsync(t => t.TicketId == request.TicketId, cancellationToken);

        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAssetId);

        if (ticket != null && digitalAsset != null)
        {
            ticket.DigitalAssets.Add(digitalAsset);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new();
    }
}
