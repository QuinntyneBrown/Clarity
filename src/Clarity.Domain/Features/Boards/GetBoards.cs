using Clarity.Core.Data;
using Clarity.Domain.Features.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.Boards
{
    public class GetBoards
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public ICollection<BoardDto> Boards { get;set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {
                return new Response {
                    Boards = await _context.Boards
                    .Include(x => x.States)
                    .Select(x => x.ToDto())
                    .ToListAsync()
                };
            }
        }
    }
}
