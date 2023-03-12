using MediatR;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;

public class GetDigitalAssetByIdRequest : IRequest<GetDigitalAssetByIdResponse>
{
    public Guid DigitalAssetId { get; set; }
}
public class GetDigitalAssetByIdResponse
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class GetDigitalAssetByIdHandler : IRequestHandler<GetDigitalAssetByIdRequest, GetDigitalAssetByIdResponse>
{
    public IClarityDbContext _context { get; set; }
    public GetDigitalAssetByIdHandler(IClarityDbContext context) => _context = context;
    public async Task<GetDigitalAssetByIdResponse> Handle(GetDigitalAssetByIdRequest request, CancellationToken cancellationToken)
        => new()
        {
            DigitalAsset = DigitalAssetDto.FromDigitalAsset(await _context.DigitalAssets.FindAsync(request.DigitalAssetId))
        };
}
