// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;

public class UploadDigitalAssetRequest : IRequest<UploadDigitalAssetResponse>
{
    public IFormFile File { get; set; }
}

public class UploadDigitalAssetResponse
{
    public Guid DigitalAssetId { get; set; }
}

public class UploadDigitalAssetHandler : IRequestHandler<UploadDigitalAssetRequest, UploadDigitalAssetResponse>
{
    private readonly IClarityDbContext _context;

    public UploadDigitalAssetHandler(IClarityDbContext context) => _context = context;

    public async Task<UploadDigitalAssetResponse> Handle(UploadDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        using var memoryStream = new MemoryStream();
        await request.File.CopyToAsync(memoryStream, cancellationToken);

        var digitalAsset = new DigitalAsset(
            request.File.FileName,
            memoryStream.ToArray(),
            request.File.ContentType);

        _context.DigitalAssets.Add(digitalAsset);
        await _context.SaveChangesAsync(cancellationToken);

        return new() { DigitalAssetId = digitalAsset.DigitalAssetId };
    }
}
