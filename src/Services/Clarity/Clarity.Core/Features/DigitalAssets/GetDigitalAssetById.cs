using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Clarity.Core;
using System;

namespace Clarity.Domain.Features
{
    public class GetDigitalAssetById
    {
        public class Request : IRequest<Response>
        {
            public Guid DigitalAssetId { get; set; }
        }

        public class Response
        {
            public DigitalAssetDto DigitalAsset { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityDbContext _context { get; set; }

            public Handler(IClarityDbContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new()
            {
                DigitalAsset = DigitalAssetDto.FromDigitalAsset(await _context.DigitalAssets.FindAsync(request.DigitalAssetId))
            };
        }
    }
}
