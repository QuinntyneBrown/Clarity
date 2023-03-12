using Clarity.Core.AggregateModel.UserAggregate.Commands;
using Clarity.Core.AggregateModel.UserAggregate.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers;

 [ApiController]
 [Route("api/[controller]")]
 public class UserController
 {
    private readonly IMediator _mediator;
    public UserController(IMediator mediator)
        => _mediator = mediator;

    [HttpPost("token")]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(Authenticate.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<Authenticate.Response>> Authenticate(Authenticate.Request request)
        => await _mediator.Send(request);

    [HttpGet]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetCurrentUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetCurrentUser.Response>> GetCurrentUser(GetCurrentUser.Request request)
        => await _mediator.Send(request);
 }
