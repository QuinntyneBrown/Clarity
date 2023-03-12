using MediatR;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;

public class GetDigitalAssetsRequest : IRequest<GetDigitalAssetsResponse> { }
public class GetDigitalAssetsResponse
{
    public IEnumerable<DigitalAssetDto> DigitalAssets { get; set; }
}
public class GetDigitalAssetsHandler : IRequestHandler<GetDigitalAssetsRequest, GetDigitalAssetsResponse>
{
    public IClarityDbContext _context { get; set; }
    public GetDigitalAssetsHandler(IClarityDbContext context) => _context = context;
    public async Task<GetDigitalAssetsResponse> Handle(GetDigitalAssetsRequest request, CancellationToken cancellationToken)
        => new()
        {
            DigitalAssets = await _context.DigitalAssets.Select(x => DigitalAssetDto.FromDigitalAsset(x)).ToListAsync()
        };
}
