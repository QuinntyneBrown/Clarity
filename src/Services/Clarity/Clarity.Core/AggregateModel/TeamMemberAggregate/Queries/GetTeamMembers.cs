using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;

 public class GetTeamMembers
 {
     public class Request : IRequest<Response> { }
     public class Response
     {
         public IEnumerable<TeamMemberDto> TeamMembers { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly IClarityDbContext _context;
         public Handler(IClarityDbContext context) => _context = context;
         public Task<Response> Handle(Request request, CancellationToken cancellationToken)
             => Task.FromResult(new Response()
             {
                 TeamMembers = _context.TeamMembers
                 .Select(x => x.ToDto())
                 .ToList()
             });
     }
 }
