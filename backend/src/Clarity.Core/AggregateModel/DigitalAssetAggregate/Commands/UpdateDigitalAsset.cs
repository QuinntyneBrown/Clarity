// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class UpdateDigitalAssetRequest : IRequest<UpdateDigitalAssetResponse>
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; }
    public IFormFile File { get; set; }
}

public class UpdateDigitalAssetResponse
{
    public Guid DigitalAssetId { get; set; }
}

public class UpdateDigitalAssetHandler : IRequestHandler<UpdateDigitalAssetRequest, UpdateDigitalAssetResponse>
{
    private readonly IClarityDbContext _context;

    public UpdateDigitalAssetHandler(IClarityDbContext context) => _context = context;

    public async Task<UpdateDigitalAssetResponse> Handle(UpdateDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.FindAsync(request.DigitalAssetId);
        if (digitalAsset == null)
            throw new Exception("Digital asset not found");

        if (request.File != null)
        {
            using var memoryStream = new MemoryStream();
            await request.File.CopyToAsync(memoryStream, cancellationToken);
            digitalAsset.Update(
                request.Name ?? request.File.FileName,
                memoryStream.ToArray(),
                request.File.ContentType);
        }
        else if (!string.IsNullOrEmpty(request.Name))
        {
            digitalAsset.SetName(request.Name);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return new() { DigitalAssetId = digitalAsset.DigitalAssetId };
    }
}
