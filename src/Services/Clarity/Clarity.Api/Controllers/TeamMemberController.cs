using Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Clarity.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TeamMemberController
    {
        private readonly IMediator _mediator;

        public TeamMemberController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{teamMemberId}")]
        public async Task<ActionResult<GetTeamMemberById.Response>> GetById([FromRoute] GetTeamMemberById.Request request)
            => await _mediator.Send(request);

        [HttpGet]
        public async Task<ActionResult<GetTeamMembers.Response>> Get()
            => await _mediator.Send(new GetTeamMembers.Request());

        [HttpGet("current")]
        public async Task<ActionResult<GetCurrentTeamMember.Response>> GetCurrent()
            => await _mediator.Send(new GetCurrentTeamMember.Request());
    }
}
