using Clarity.Domain.Features.Identity;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController
    {
        private readonly IMediator _mediator;
        
        public UsersController(IMediator mediator) {
            _mediator = mediator;
        }

        [HttpPost("token")]
        public async Task<ActionResult<AuthenticateCommand.Response>> SignIn(AuthenticateCommand.Request request)
        {
            try
            {
                return await _mediator.Send(request);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
