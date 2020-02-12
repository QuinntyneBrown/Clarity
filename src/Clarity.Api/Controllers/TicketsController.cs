using Clarity.Domain.Features.Tickets;
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
        private readonly IMediator _meditator;

        public TicketsController(IMediator mediator) => _meditator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetTickets.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetTickets.Response>> Get()
            => await _meditator.Send(new GetTickets.Request());

        [HttpGet("{name}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetTicketByName.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetTicketByName.Response>> GetByName([FromRoute]GetTicketByName.Request request)
            => await _meditator.Send(request);

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpsertTicket.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpsertTicket.Response>> Upsert([FromBody]UpsertTicket.Request request)
            => await _meditator.Send(request);
    }
}
