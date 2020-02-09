using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/states")]
    public class StatesController
    {
        private readonly IMediator _meditator;

        public StatesController(IMediator mediator) => _meditator = mediator;
    }
}
