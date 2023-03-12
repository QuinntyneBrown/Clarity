using Clarity.Core.AggregateModel.CommentAggregate.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController
    {
        private readonly IMediator _mediator;

        public CommentController(IMediator mediator)
            => _mediator = mediator;

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpsertComment.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpsertComment.Response>> Upsert([FromBody] UpsertComment.Request request)
            => await _mediator.Send(request);
    }
}
