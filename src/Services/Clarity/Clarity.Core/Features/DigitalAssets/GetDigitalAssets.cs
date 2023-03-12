using MediatR;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using Clarity.Core;
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
            public IClarityDbContext _context { get; set; }

            public Handler(IClarityDbContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new()
            {
                DigitalAssets = await _context.DigitalAssets.Select(x => DigitalAssetDto.FromDigitalAsset(x)).ToListAsync()
            };
        }
    }
}
