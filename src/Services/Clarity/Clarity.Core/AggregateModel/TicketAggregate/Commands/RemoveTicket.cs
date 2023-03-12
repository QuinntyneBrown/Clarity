// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Kernel;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

public class RemoveTicketRequest : IRequest<RemoveTicketResponse>
{
    public int TicketId { get; set; }
}

public class RemoveTicketResponse : ResponseBase { }

public class RemoveTicketRequestHandler : IRequestHandler<RemoveTicketRequest, RemoveTicketResponse>
{
    private readonly IClarityDbContext _context;
    public RemoveTicketRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<RemoveTicketResponse> Handle(RemoveTicketRequest request, CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets.FindAsync(request.TicketId);

        _context.Tickets.Remove(ticket);

        await _context.SaveChangesAsync(cancellationToken);

        return new();
    }
}

