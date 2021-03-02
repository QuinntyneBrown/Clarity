using Clarity.Domain.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    public class TicketsController
    {
        private readonly IMediator _mediator;

        public TicketsController(IMediator mediator) 
            => _mediator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetTickets.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetTickets.Response>> Get()
            => await _mediator.Send(new GetTickets.Request());

        [HttpGet("{name}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetTicketByName.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetTicketByName.Response>> GetByName([FromRoute]GetTicketByName.Request request)
            => await _mediator.Send(request);

        [HttpGet("board/{boardId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetTicketsByBoardId.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetTicketsByBoardId.Response>> GetByBoardId([FromRoute]GetTicketsByBoardId.Request request)
            => await _mediator.Send(request);

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpsertTicket.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpsertTicket.Response>> Upsert([FromBody]UpsertTicket.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{ticketId}")]
        public async Task Remove([FromRoute]RemoveTicket.Request request)
            => await _mediator.Send(request);
    }
}
