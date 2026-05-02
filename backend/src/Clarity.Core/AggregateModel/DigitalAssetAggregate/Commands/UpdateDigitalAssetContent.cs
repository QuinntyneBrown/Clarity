// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class UpdateDigitalAssetContentRequest : IRequest<UpdateDigitalAssetContentResponse>
{
    public Guid DigitalAssetId { get; set; }
    public string Content { get; set; }
}

public class UpdateDigitalAssetContentResponse
{
    public Guid DigitalAssetId { get; set; }
}

public class UpdateDigitalAssetContentHandler : IRequestHandler<UpdateDigitalAssetContentRequest, UpdateDigitalAssetContentResponse>
{
    private readonly IClarityDbContext _context;

    public UpdateDigitalAssetContentHandler(IClarityDbContext context) => _context = context;

    public async Task<UpdateDigitalAssetContentResponse> Handle(UpdateDigitalAssetContentRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAssetId);
        if (digitalAsset == null)
            throw new Exception("Digital asset not found");

        var bytes = Encoding.UTF8.GetBytes(request.Content);
        digitalAsset.Update(digitalAsset.Name, bytes, digitalAsset.ContentType);

        await _context.SaveChangesAsync(cancellationToken);
        return new() { DigitalAssetId = digitalAsset.DigitalAssetId };
    }
}
