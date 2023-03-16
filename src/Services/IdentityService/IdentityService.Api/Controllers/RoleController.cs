// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using IdentityService.Core.AggregateModel.RoleAggregate.Commands;
using IdentityService.Core.AggregateModel.RoleAggregate.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Net.Mime;

namespace IdentityService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class RoleController
{
    private readonly IMediator _mediator;
    private readonly ILogger<RoleController> _logger;

    public RoleController(IMediator mediator, ILogger<RoleController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Update RoleId",
        Description = @"Update RoleId"
    )]
    [HttpPut(Name = "updateRoleId")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateRoleResponse>> Update([FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Create Role",
        Description = @"Create Role"
    )]
    [HttpPost(Name = "createRole")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateRoleResponse>> Create([FromBody] CreateRoleRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Roles",
        Description = @"Get Roles"
    )]
    [HttpGet(Name = "getRoles")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetRolesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetRolesResponse>> Get(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetRolesRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Role  by id",
        Description = @"Get Role by id"
    )]
    [HttpGet("{roleId:guid}", Name = "getRoleById")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetRoleByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetRoleByIdResponse>> GetById([FromRoute] Guid roleId, CancellationToken cancellationToken)
    {
        var request = new GetRoleByIdRequest() { RoleId = roleId };

        var response = await _mediator.Send(request, cancellationToken);

        if (response.Role == null)
        {
            return new NotFoundObjectResult(request.RoleId);
        }

        return response;
    }

    [SwaggerOperation(
        Summary = "Delete Role",
        Description = @"Delete Role"
    )]
    [HttpDelete("{roleId:guid}", Name = "deleteRole")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(DeleteRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<DeleteRoleResponse>> Delete([FromRoute] Guid roleId, CancellationToken cancellationToken)
    {
        var request = new DeleteRoleRequest() { RoleId = roleId };

        return await _mediator.Send(request, cancellationToken);
    }

}


