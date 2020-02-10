using Clarity.Domain.Features.States;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/states")]
    public class StatesController
    {
        private readonly IMediator _meditator;

        public StatesController(IMediator mediator) => _meditator = mediator;

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetStates.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetStates.Response>> Get()
            => await _meditator.Send(new GetStates.Request());
    }
}
