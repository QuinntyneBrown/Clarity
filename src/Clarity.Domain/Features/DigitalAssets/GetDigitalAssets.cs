using MediatR;
using System.Threading.Tasks;   
using System.Threading;
using System.Collections.Generic;
using Clarity.Core.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Domain.Features
{
    public class GetDigitalAssets
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public IEnumerable<DigitalAssetDto> DigitalAssets { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new Response()
                {
                    DigitalAssets = await _context.DigitalAssets.Select(x => DigitalAssetDto.FromDigitalAsset(x)).ToListAsync()
                };
        }
    }
}
