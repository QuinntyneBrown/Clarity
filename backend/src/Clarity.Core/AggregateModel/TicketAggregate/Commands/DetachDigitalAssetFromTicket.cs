// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

public class DetachDigitalAssetFromTicketRequest : IRequest<DetachDigitalAssetFromTicketResponse>
{
    public Guid TicketId { get; set; }
    public Guid DigitalAssetId { get; set; }
}

public class DetachDigitalAssetFromTicketResponse { }

public class DetachDigitalAssetFromTicketHandler : IRequestHandler<DetachDigitalAssetFromTicketRequest, DetachDigitalAssetFromTicketResponse>
{
    private readonly IClarityDbContext _context;

    public DetachDigitalAssetFromTicketHandler(IClarityDbContext context) => _context = context;

    public async Task<DetachDigitalAssetFromTicketResponse> Handle(DetachDigitalAssetFromTicketRequest request, CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets
            .Include(t => t.DigitalAssets)
            .FirstOrDefaultAsync(t => t.TicketId == request.TicketId, cancellationToken);

        if (ticket != null)
        {
            var asset = ticket.DigitalAssets.FirstOrDefault(a => a.DigitalAssetId == request.DigitalAssetId);
            if (asset != null)
            {
                ticket.DigitalAssets.Remove(asset);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return new();
    }
}
