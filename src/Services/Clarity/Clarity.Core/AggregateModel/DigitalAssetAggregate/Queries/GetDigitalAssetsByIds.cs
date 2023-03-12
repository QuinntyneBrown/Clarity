using MediatR;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;

public class GetDigitalAssetsByIdsRequest : IRequest<GetDigitalAssetsByIdsResponse>
{
    public Guid[] DigitalAssetIds { get; set; }
}
public class GetDigitalAssetsByIdsResponse
{
    public IEnumerable<DigitalAssetDto> DigitalAssets { get; set; }
}
public class GetDigitalAssetsByIdsHandler : IRequestHandler<GetDigitalAssetsByIdsRequest, GetDigitalAssetsByIdsResponse>
{
    public IClarityDbContext _context { get; set; }
    public GetDigitalAssetsByIdsHandler(IClarityDbContext context) => _context = context;
    public async Task<GetDigitalAssetsByIdsResponse> Handle(GetDigitalAssetsByIdsRequest request, CancellationToken cancellationToken)
        => new()
        {
            DigitalAssets = await _context.DigitalAssets
            .Where(x => request.DigitalAssetIds.Contains(x.DigitalAssetId))
            .Select(x => DigitalAssetDto.FromDigitalAsset(x)).ToListAsync()
        };
}
