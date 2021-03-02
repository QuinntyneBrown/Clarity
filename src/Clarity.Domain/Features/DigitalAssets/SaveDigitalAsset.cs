using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Clarity.Core.Models;
using Clarity.Core.Data;
using System;

namespace Clarity.Domain.Features
{
    public class SaveDigitalAsset
    {
        public class Request : IRequest<Response> {
            public DigitalAssetDto DigitalAsset { get; set; }
        }

        public class Response
        {            
            public Guid DigitalAssetId { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAsset.DigitalAssetId);

                if (digitalAsset == null) _context.DigitalAssets.Add(digitalAsset = new DigitalAsset());

                digitalAsset.Name = request.DigitalAsset.Name;

                await _context.SaveChangesAsync(cancellationToken);

                return new Response() { DigitalAssetId = digitalAsset.DigitalAssetId };
            }
        }
    }
}
