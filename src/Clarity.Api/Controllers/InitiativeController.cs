// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.InitiativeAggregate.Commands;
using Clarity.Core.AggregateModel.InitiativeAggregate.Queries;
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
public class InitiativeController : ControllerBase
{
    private readonly IMediator _mediator;

    private readonly ILogger<InitiativeController> _logger;

    public InitiativeController(IMediator mediator, ILogger<InitiativeController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Create Initiative",
        Description = @"Create Initiative"
    )]
    [HttpPost(Name = "createInitiative")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateInitiativeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateInitiativeResponse>> CreateInitiative([FromBody] CreateInitiativeRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Update Initiative",
        Description = @"Update Initiative"
    )]
    [HttpPut(Name = "updateInitiative")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateInitiativeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateInitiativeResponse>> UpdateInitiative([FromBody] UpdateInitiativeRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Initiatives",
        Description = @"Get Initiatives"
    )]
    [HttpGet(Name = "getInitiatives")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInitiativesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInitiativesResponse>> GetInitiatives(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetInitiativesRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Initiative By Id",
        Description = @"Get Initiative By Id"
    )]
    [HttpGet("{initiativeId:guid}", Name = "getInitiativeById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInitiativeByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInitiativeByIdResponse>> GetInitiativeById([FromRoute] GetInitiativeByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Delete Initiative",
        Description = @"Delete Initiative"
    )]
    [HttpDelete("{initiativeId:guid}", Name = "deleteInitiative")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveInitiativeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveInitiativeResponse>> Delete([FromRoute] Guid initiativeId, CancellationToken cancellationToken)
    {
        var request = new RemoveInitiativeRequest() { InitiativeId = initiativeId };

        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Initiative Report",
        Description = @"Get report for a single initiative with ticket breakdown by state"
    )]
    [HttpGet("{initiativeId:guid}/report", Name = "getInitiativeReport")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInitiativeReportResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInitiativeReportResponse>> GetInitiativeReport([FromRoute] Guid initiativeId, CancellationToken cancellationToken)
    {
        var request = new GetInitiativeReportRequest() { InitiativeId = initiativeId };

        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Initiative Reports",
        Description = @"Get reports for all initiatives with ticket breakdown by state"
    )]
    [HttpGet("reports", Name = "getInitiativeReports")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInitiativeReportsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInitiativeReportsResponse>> GetInitiativeReports(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetInitiativeReportsRequest(), cancellationToken);
    }
}
