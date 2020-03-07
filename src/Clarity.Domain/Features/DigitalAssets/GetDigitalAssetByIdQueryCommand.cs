using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Clarity.Core.Data;
using System;

namespace Clarity.Domain.Features.DigitalAssets
{
    public class GetDigitalAssetByIdQuery
    {
        public class Request : IRequest<Response> {
            public Guid DigitalAssetId { get; set; }
        }

        public class Response
        {
            public DigitalAssetDto DigitalAsset { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new Response()
                {
                    DigitalAsset = DigitalAssetDto.FromDigitalAsset(await _context.DigitalAssets.FindAsync(request.DigitalAssetId))
                };
        }
    }
}
