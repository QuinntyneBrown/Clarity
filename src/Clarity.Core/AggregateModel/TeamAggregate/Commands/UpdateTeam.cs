// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.TeamAggregate.Commands;

public class UpdateTeamRequestValidator : AbstractValidator<UpdateTeamRequest>
{
    public UpdateTeamRequestValidator()
    {
        RuleFor(x => x.TeamId).NotNull().NotEmpty();
        RuleFor(x => x.Name).NotNull().NotEmpty();
    }
}

public class UpdateTeamRequest : IRequest<UpdateTeamResponse>
{
    public Guid TeamId { get; set; }
    public required string Name { get; set; }
}

public class UpdateTeamResponse : ResponseBase
{
    public required TeamDto Team { get; set; }
}

public class UpdateTeamRequestHandler : IRequestHandler<UpdateTeamRequest, UpdateTeamResponse>
{
    private readonly ILogger<UpdateTeamRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdateTeamRequestHandler(ILogger<UpdateTeamRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateTeamResponse> Handle(UpdateTeamRequest request, CancellationToken cancellationToken)
    {
        var team = await _context.Teams.SingleAsync(x => x.TeamId == request.TeamId);

        team.Update(request.Name);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Team = team.ToDto()
        };
    }
}
