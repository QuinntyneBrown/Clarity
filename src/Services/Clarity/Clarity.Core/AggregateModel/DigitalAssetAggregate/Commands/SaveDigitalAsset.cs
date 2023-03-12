using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class SaveDigitalAsset
{
    public class Request : IRequest<Response>
    {
        public DigitalAssetDto DigitalAsset { get; set; }
    }

    public class Response
    {
        public Guid DigitalAssetId { get; set; }
    }

    public class Handler : IRequestHandler<Request, Response>
    {
        public IClarityDbContext _context { get; set; }

        public Handler(IClarityDbContext context) => _context = context;

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAsset.DigitalAssetId);

            if (digitalAsset == null) _context.DigitalAssets.Add(digitalAsset = new DigitalAsset(request.DigitalAsset.Name));

            await _context.SaveChangesAsync(cancellationToken);

            return new() { DigitalAssetId = digitalAsset.DigitalAssetId };
        }
    }
}
