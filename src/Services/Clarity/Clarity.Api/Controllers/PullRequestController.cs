using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PullRequestController
    {
        private readonly IMediator _mediator;

        public PullRequestController(IMediator mediator)
            => _mediator = mediator;
    }
}
