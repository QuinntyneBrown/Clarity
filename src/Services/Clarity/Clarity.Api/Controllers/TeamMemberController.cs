// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;
using static Clarity.Core.AggregateModel.TeamMemberAggregate.Queries.GetCurrentTeamMember;
using static Clarity.Core.AggregateModel.TeamMemberAggregate.Queries.GetTeamMemberById;
using static Clarity.Core.AggregateModel.TeamMemberAggregate.Queries.GetTeamMembers;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class TeamMemberController
{
    private readonly IMediator _mediator;

    private readonly ILogger<TeamMemberController> _logger;

    public TeamMemberController(IMediator mediator,ILogger<TeamMemberController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Current Team Member",
        Description = @"Get Current Team Member"
    )]
    [HttpGet(Name = "getCurrentTeamMember")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetCurrentTeamMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetCurrentTeamMemberResponse>> GetCurrentTeamMember(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetCurrentTeamMemberRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Team Member By Id",
        Description = @"Get Team Member By Id"
    )]
    [HttpGet("{teamMemberId:guid}", Name = "getTeamMemberById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTeamMemberByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTeamMemberByIdResponse>> GetTeamMemberById([FromRoute] GetTeamMemberByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Team Members",
        Description = @"Get Team Members"
    )]
    [HttpGet(Name = "getTeamMembers")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTeamMembersResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTeamMembersResponse>> GetTeamMembers(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetTeamMembersRequest(), cancellationToken);
    }
}


