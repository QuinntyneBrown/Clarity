// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Kernel;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Commands;

public class RemoveInitiativeRequest : IRequest<RemoveInitiativeResponse>
{
    public Guid InitiativeId { get; set; }
}

public class RemoveInitiativeResponse : ResponseBase { }

public class RemoveInitiativeRequestHandler : IRequestHandler<RemoveInitiativeRequest, RemoveInitiativeResponse>
{
    private readonly IClarityDbContext _context;
    public RemoveInitiativeRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<RemoveInitiativeResponse> Handle(RemoveInitiativeRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives.FindAsync(request.InitiativeId);

        if (initiative == null)
        {
            return new();
        }

        _context.Initiatives.Remove(initiative);

        await _context.SaveChangesAsync(cancellationToken);

        return new();
    }
}
