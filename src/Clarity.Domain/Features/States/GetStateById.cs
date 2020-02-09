using Clarity.Core.Data;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.States
{
    public class GetStateById
    {
        public class Request : IRequest<Response> {
            public Guid StateId { get; set; }
        }

        public class Response
        {
            public StateDto State { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context)
            {
                _context = context;
            }

            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
