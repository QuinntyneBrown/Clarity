// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;
using Clarity.Core.AggregateModel.CommentAggregate.Commands;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class CommentController
{
    private readonly IMediator _mediator;

    private readonly ILogger<CommentController> _logger;

    public CommentController(IMediator mediator,ILogger<CommentController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Upsert Comment",
        Description = @"Upsert Comment"
    )]
    [HttpPost(Name = "upsertComment")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpsertCommentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpsertCommentResponse>> UpsertComment([FromBody] UpsertCommentRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }
}


