// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TicketAggregate.Commands;
using Clarity.Core.AggregateModel.TicketAggregate.Queries;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class TicketController
{
    private readonly IMediator _mediator;

    private readonly ILogger<TicketController> _logger;

    public TicketController(IMediator mediator,ILogger<TicketController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Upsert Ticket",
        Description = @"Upsert Ticket"
    )]
    [HttpPut(Name = "upsertTicket")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpsertTicketResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpsertTicketResponse>> Update([FromBody]UpsertTicketRequest request,CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Tickets",
        Description = @"Get Tickets"
    )]
    [HttpGet(Name = "getTickets")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTicketsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTicketsResponse>> Get(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetTicketsRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Ticket by Name",
        Description = @"Get Ticket by Name"
    )]
    [HttpGet("name/{name}", Name = "getTicketByName")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTicketByNameResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTicketByNameResponse>> GetTicketByName([FromRoute]string name,CancellationToken cancellationToken)
    {
        var request = new GetTicketByNameRequest(){ Name = name};

        var response = await _mediator.Send(request, cancellationToken);

        if (response.Ticket == null)
        {
            return new NotFoundObjectResult(request.Name);
        }

        return response;
    }

    [SwaggerOperation(
        Summary = "Delete Ticket",
        Description = @"Delete Ticket"
    )]
    [HttpDelete("{ticketId:guid}", Name = "deleteTicket")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveTicketResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveTicketResponse>> Delete([FromRoute]Guid ticketId,CancellationToken cancellationToken)
    {
        var request = new RemoveTicketRequest() { TicketId = ticketId };

        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Tickets By Board Id",
        Description = @"Get Tickets By Board Id"
    )]
    [HttpGet("board/{boardId:guid}", Name = "getTicketsByBoardId")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTicketsByBoardIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTicketsByBoardIdResponse>> GetTicketsByBoardId([FromRoute] GetTicketsByBoardIdRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get Tickets By Board Name",
        Description = @"Get Tickets By Board Name"
    )]
    [HttpGet("board/name/{name}", Name = "getTicketsByBoardName")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetTicketsByBoardNameResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTicketsByBoardNameResponse>> GetTicketsByBoardName([FromRoute] GetTicketsByBoardNameRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

}


