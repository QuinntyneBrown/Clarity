// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Commands;

public class CreateInitiativeRequestValidator : AbstractValidator<CreateInitiativeRequest>
{
    public CreateInitiativeRequestValidator()
    {
        RuleFor(x => x.Name).NotNull().NotEmpty();
    }
}

public class CreateInitiativeRequest : IRequest<CreateInitiativeResponse>
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class CreateInitiativeResponse
{
    public required InitiativeDto Initiative { get; set; }
}

public class CreateInitiativeRequestHandler : IRequestHandler<CreateInitiativeRequest, CreateInitiativeResponse>
{
    private readonly IClarityDbContext _context;
    private readonly ILogger<CreateInitiativeRequestHandler> _logger;

    public CreateInitiativeRequestHandler(
        ILogger<CreateInitiativeRequestHandler> logger,
        IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<CreateInitiativeResponse> Handle(CreateInitiativeRequest request, CancellationToken cancellationToken)
    {
        var initiative = new Initiative(request.Name, request.Description);

        _context.Initiatives.Add(initiative);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Initiative = initiative.ToDto()
        };
    }
}
