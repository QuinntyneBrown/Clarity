// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Commands;

public class UpdateInitiativeRequestValidator : AbstractValidator<UpdateInitiativeRequest>
{
    public UpdateInitiativeRequestValidator()
    {
        RuleFor(x => x.InitiativeId).NotEqual(default(Guid));
        RuleFor(x => x.Name).NotNull().NotEmpty();
    }
}

public class UpdateInitiativeRequest : IRequest<UpdateInitiativeResponse>
{
    public Guid InitiativeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class UpdateInitiativeResponse
{
    public required InitiativeDto Initiative { get; set; }
}

public class UpdateInitiativeRequestHandler : IRequestHandler<UpdateInitiativeRequest, UpdateInitiativeResponse>
{
    private readonly IClarityDbContext _context;

    public UpdateInitiativeRequestHandler(IClarityDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateInitiativeResponse> Handle(UpdateInitiativeRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives
            .Include(x => x.Tickets)
            .SingleOrDefaultAsync(x => x.InitiativeId == request.InitiativeId, cancellationToken);

        if (initiative == null)
        {
            throw new InvalidOperationException($"Initiative with id {request.InitiativeId} not found.");
        }

        initiative.Update(request.Name, request.Description);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Initiative = initiative.ToDto()
        };
    }
}
