using Clarity.Core.Data;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.States
{
    public class RemoveState
    {
        public class Request : IRequest
        {
            public int StateId { get; set; }
        }

        public class Handler : IRequestHandler<Request>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context)
            {
                _context = context;
            }

            public Task<Unit> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
