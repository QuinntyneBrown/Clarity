// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace Clarity.Core.AggregateModel.SprintAggregate.Commands;

public class CreateSprintValidator : AbstractValidator<CreateSprintRequest>
{
    public CreateSprintValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
        RuleFor(x => x.TeamId)
            .NotNull()
            .NotEmpty();
    }
}

public class CreateSprintRequest : IRequest<CreateSprintResponse>
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public Guid TeamId { get; set; }
}

public class CreateSprintResponse
{
    public SprintDto Sprint { get; set; }
}

public class CreateSprintRequestHandler : IRequestHandler<CreateSprintRequest, CreateSprintResponse>
{
    private readonly IClarityDbContext _context;

    public CreateSprintRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<CreateSprintResponse> Handle(CreateSprintRequest request, CancellationToken cancellationToken)
    {
        var sprint = new Sprint(request.Name, request.Start, request.End, request.TeamId);

        _context.Sprints.Add(sprint);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Sprint = sprint.ToDto() };
    }
}
