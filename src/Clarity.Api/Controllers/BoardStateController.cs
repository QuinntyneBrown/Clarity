using Clarity.Domain.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardStateController
    {
        private readonly IMediator _meditator;

        public BoardStateController(IMediator mediator)
            => _meditator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardStates.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardStates.Response>> Get()
            => await _meditator.Send(new GetBoardStates.Request());
    }
}
