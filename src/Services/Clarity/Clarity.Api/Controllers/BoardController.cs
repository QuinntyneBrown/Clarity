using Clarity.Domain.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BoardController
    {
        private readonly IMediator _mediator;
        public BoardController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoards.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoards.Response>> Get()
            => await _mediator.Send(new GetBoards.Request());

        [HttpGet("{boardId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardById.Response>> GetById([FromRoute] GetBoardById.Request request)
            => await _mediator.Send(request);

        [HttpGet("name/{name}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardByName.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardByName.Response>> GetByName([FromRoute] GetBoardByName.Request request)
            => await _mediator.Send(request);
    }
}
