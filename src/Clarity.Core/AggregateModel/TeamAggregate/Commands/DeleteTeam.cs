// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.TeamAggregate.Commands;

public class DeleteTeamRequestValidator : AbstractValidator<DeleteTeamRequest> { }

public class DeleteTeamRequest : IRequest<DeleteTeamResponse>
{
    public Guid TeamId { get; set; }
}

public class DeleteTeamResponse : ResponseBase
{
    public TeamDto Team { get; set; }
}

public class DeleteTeamRequestHandler : IRequestHandler<DeleteTeamRequest, DeleteTeamResponse>
{
    private readonly ILogger<DeleteTeamRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public DeleteTeamRequestHandler(ILogger<DeleteTeamRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeleteTeamResponse> Handle(DeleteTeamRequest request, CancellationToken cancellationToken)
    {
        var team = await _context.Teams.FindAsync(request.TeamId);

        _context.Teams.Remove(team);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Team = team.ToDto()
        };
    }
}
