// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;
using Clarity.Core.AggregateModel.BoardStateAggregate.Queries;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class BoardStateController
{
    private readonly IMediator _mediator;

    private readonly ILogger<BoardStateController> _logger;

    public BoardStateController(IMediator mediator,ILogger<BoardStateController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Board State By Id",
        Description = @"Get Board State By Id"
    )]
    [HttpGet("{boardStateId:guid}", Name = "getBoardStateById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardStateByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardStateByIdResponse>> GetBoardStateById([FromRoute] GetBoardStateByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Board States",
        Description = @"Get Board States"
    )]
    [HttpGet(Name = "getBoardStates")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardStatesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardStatesResponse>> GetBoardStates(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetBoardStatesRequest(), cancellationToken);
    }
}