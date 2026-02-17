// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserSettingsAggregate;
using Clarity.Core.AggregateModel.UserSettingsAggregate.Commands;
using Clarity.Core.AggregateModel.UserSettingsAggregate.Queries;
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
public class UserSettingsController
{
    private readonly IMediator _mediator;
    private readonly ILogger<UserSettingsController> _logger;

    public UserSettingsController(IMediator mediator, ILogger<UserSettingsController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get User Settings",
        Description = @"Get User Settings by User ID"
    )]
    [HttpGet("{userId:guid}", Name = "getUserSettings")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetUserSettingsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUserSettingsResponse>> Get([FromRoute] Guid userId, CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetUserSettingsRequest { UserId = userId }, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Update User Settings",
        Description = @"Update User Settings"
    )]
    [HttpPut(Name = "updateUserSettings")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateUserSettingsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateUserSettingsResponse>> Update([FromBody] UpdateUserSettingsRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }
}
