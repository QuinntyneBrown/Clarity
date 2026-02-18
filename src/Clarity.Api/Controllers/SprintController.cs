// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.SprintAggregate.Commands;
using Clarity.Core.AggregateModel.SprintAggregate.Queries;
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
public class SprintController
{
    private readonly IMediator _mediator;

    private readonly ILogger<SprintController> _logger;

    public SprintController(IMediator mediator,ILogger<SprintController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Sprint By Id",
        Description = @"Get Sprint By Id"
    )]
    [HttpGet("{sprintId:guid}",Name = "getSprintById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetSprintByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetSprintByIdResponse>> GetSprintById([FromRoute] GetSprintByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Sprints",
        Description = @"Get Sprints"
    )]
    [HttpGet(Name = "getSprints")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetSprintsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetSprintsResponse>> GetSprints(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetSprintsRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Create Sprint",
        Description = @"Create Sprint"
    )]
    [HttpPost(Name = "createSprint")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateSprintResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateSprintResponse>> CreateSprint([FromBody] CreateSprintRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Update Sprint",
        Description = @"Update Sprint"
    )]
    [HttpPut(Name = "updateSprint")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateSprintResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateSprintResponse>> UpdateSprint([FromBody] UpdateSprintRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Delete Sprint",
        Description = @"Delete Sprint"
    )]
    [HttpDelete("{sprintId:guid}",Name = "deleteSprint")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(DeleteSprintResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<DeleteSprintResponse>> DeleteSprint([FromRoute] DeleteSprintRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }
}
