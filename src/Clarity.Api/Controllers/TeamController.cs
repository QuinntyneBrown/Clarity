// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TeamAggregate.Commands;
using Clarity.Core.AggregateModel.TeamAggregate.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace Clarity.Api.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class TeamController
{
    private readonly IMediator _mediator;

    private readonly ILogger<TeamController> _logger;

    public TeamController(IMediator mediator,ILogger<TeamController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Team By Id",
        Description = @"Get Team By Id"
    )]
    [HttpGet("{teamId:guid}",Name = "getTeamById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTeamByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTeamByIdResponse>> GetTeamById([FromRoute] GetTeamByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Teams",
        Description = @"Get Teams"
    )]
    [HttpGet(Name = "getTeams")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTeamsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTeamsResponse>> GetTeams(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetTeamsRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Create Team",
        Description = @"Create Team"
    )]
    [HttpPost(Name = "createTeam")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateTeamResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateTeamResponse>> CreateTeam([FromBody] CreateTeamRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Update Team",
        Description = @"Update Team"
    )]
    [HttpPut(Name = "updateTeam")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateTeamResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateTeamResponse>> UpdateTeam([FromBody] UpdateTeamRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Delete Team",
        Description = @"Delete Team"
    )]
    [HttpDelete("{teamId:guid}",Name = "deleteTeam")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(DeleteTeamResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<DeleteTeamResponse>> DeleteTeam([FromRoute] DeleteTeamRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }
}
