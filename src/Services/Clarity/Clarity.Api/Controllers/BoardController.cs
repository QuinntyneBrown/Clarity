// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate.Commands;
using Clarity.Core.AggregateModel.BoardAggregate.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class BoardController
{
    private readonly IMediator _mediator;

    private readonly ILogger<BoardController> _logger;

    public BoardController(IMediator mediator,ILogger<BoardController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Board By Id",
        Description = @"Get Board By Id"
    )]
    [HttpGet("{boardId:guid}",Name = "getBoardById")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardByIdResponse>> GetBoardById([FromRoute] GetBoardByIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Boards",
        Description = @"Get Boards"
    )]
    [HttpGet(Name = "getBoards")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardsResponse>> GetBoards(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetBoardsRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Create Board",
        Description = @"Create Board"
    )]
    [HttpPost(Name = "createBoard")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateBoardResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateBoardResponse>> CreateBoard([FromBody] CreateBoardRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Board By Name",
        Description = @"Get Board By Name"
    )]
    [HttpGet("name/{name}", Name = "getBoardByName")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardByNameResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardByNameResponse>> GetByName([FromRoute] GetBoardByNameRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }
}


