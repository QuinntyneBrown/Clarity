// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.SprintAggregate.Commands;

public class DeleteSprintRequestValidator : AbstractValidator<DeleteSprintRequest> { }

public class DeleteSprintRequest : IRequest<DeleteSprintResponse>
{
    public Guid SprintId { get; set; }
}

public class DeleteSprintResponse : ResponseBase
{
    public SprintDto Sprint { get; set; }
}

public class DeleteSprintRequestHandler : IRequestHandler<DeleteSprintRequest, DeleteSprintResponse>
{
    private readonly ILogger<DeleteSprintRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public DeleteSprintRequestHandler(ILogger<DeleteSprintRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeleteSprintResponse> Handle(DeleteSprintRequest request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints.FindAsync(request.SprintId);

        if (sprint == null)
        {
            return new() { Errors = { $"Sprint with id {request.SprintId} not found." } };
        }

        var dto = sprint.ToDto();

        _context.Sprints.Remove(sprint);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Sprint = dto
        };
    }
}
