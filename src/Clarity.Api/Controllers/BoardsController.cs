using Clarity.Domain.Features.Boards;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/boards")]
    public class BoardsController
    {
        private readonly IMediator _mediator;
        public BoardsController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoards.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoards.Response>> Get()
            => await _mediator.Send(new GetBoards.Request());

        [HttpGet("{boardId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardById.Response>> GetById([FromRoute]GetBoardById.Request request)
            => await _mediator.Send(request);
    }
}
