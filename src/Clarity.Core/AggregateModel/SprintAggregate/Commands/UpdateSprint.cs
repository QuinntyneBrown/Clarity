// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.SprintAggregate.Commands;

public class UpdateSprintRequestValidator : AbstractValidator<UpdateSprintRequest>
{
    public UpdateSprintRequestValidator()
    {
        RuleFor(x => x.SprintId).NotNull().NotEmpty();
        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleFor(x => x.TeamId).NotNull().NotEmpty();
        RuleFor(x => x.End)
            .GreaterThan(x => x.Start)
            .WithMessage("End date must be after Start date.");
    }
}

public class UpdateSprintRequest : IRequest<UpdateSprintResponse>
{
    public Guid SprintId { get; set; }
    public required string Name { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public Guid TeamId { get; set; }
}

public class UpdateSprintResponse : ResponseBase
{
    public required SprintDto Sprint { get; set; }
}

public class UpdateSprintRequestHandler : IRequestHandler<UpdateSprintRequest, UpdateSprintResponse>
{
    private readonly ILogger<UpdateSprintRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdateSprintRequestHandler(ILogger<UpdateSprintRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateSprintResponse> Handle(UpdateSprintRequest request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints.SingleOrDefaultAsync(x => x.SprintId == request.SprintId);

        if (sprint == null)
        {
            return new() { Sprint = null!, Errors = { $"Sprint with id {request.SprintId} not found." } };
        }

        sprint.Update(request.Name, request.Start, request.End, request.TeamId);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Sprint = sprint.ToDto()
        };
    }
}
