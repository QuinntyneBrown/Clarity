using MediatR;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;

 public class GetDigitalAssetsByIds
 {
     public class Request : IRequest<Response>
     {
         public Guid[] DigitalAssetIds { get; set; }
     }
     public class Response
     {
         public IEnumerable<DigitalAssetDto> DigitalAssets { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         public IClarityDbContext _context { get; set; }
         public Handler(IClarityDbContext context) => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
             => new()
             {
                 DigitalAssets = await _context.DigitalAssets
                 .Where(x => request.DigitalAssetIds.Contains(x.DigitalAssetId))
                 .Select(x => DigitalAssetDto.FromDigitalAsset(x)).ToListAsync()
             };
     }
 }
