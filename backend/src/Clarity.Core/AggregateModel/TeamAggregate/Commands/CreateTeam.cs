// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace Clarity.Core.AggregateModel.TeamAggregate.Commands;

public class CreateTeamValidator : AbstractValidator<CreateTeamRequest>
{
    public CreateTeamValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
    }
}

public class CreateTeamRequest : IRequest<CreateTeamResponse>
{
    public string Name { get; set; }
}

public class CreateTeamResponse
{
    public TeamDto Team { get; set; }
}

public class CreateTeamRequestHandler : IRequestHandler<CreateTeamRequest, CreateTeamResponse>
{
    private readonly IClarityDbContext _context;

    public CreateTeamRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<CreateTeamResponse> Handle(CreateTeamRequest request, CancellationToken cancellationToken)
    {
        var team = new Team(request.Name);

        _context.Teams.Add(team);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Team = team.ToDto() };
    }
}
