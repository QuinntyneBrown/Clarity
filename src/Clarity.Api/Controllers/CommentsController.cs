using Clarity.Domain.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentsController
    {
        private readonly IMediator _mediator;

        public CommentsController(IMediator mediator)
            => _mediator = mediator;

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpsertComment.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpsertComment.Response>> Upsert([FromBody] UpsertComment.Request request)
            => await _mediator.Send(request);
    }
}
