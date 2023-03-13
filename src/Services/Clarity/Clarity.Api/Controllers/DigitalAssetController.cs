// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;
using Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class DigitalAssetController
{
    private readonly IMediator _mediator;

    private readonly ILogger<DigitalAssetController> _logger;

    public DigitalAssetController(IMediator mediator,ILogger<DigitalAssetController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(
        Summary = "Get Digital Assets",
        Description = @"Get Digital Assets"
    )]
    [HttpGet(Name = "getDigitalAssets")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetsResponse>> Get(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetDigitalAssetsRequest(), cancellationToken);
    }

    [SwaggerOperation(
        Summary = "Get DigitalAsset by id",
        Description = @"Get DigitalAsset by id"
    )]
    [HttpGet("{digitalAssetId:guid}", Name = "getDigitalAssetById")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetByIdResponse>> GetById([FromRoute]Guid digitalAssetId,CancellationToken cancellationToken)
    {
        var request = new GetDigitalAssetByIdRequest(){DigitalAssetId = digitalAssetId};

        var response = await _mediator.Send(request, cancellationToken);

        if (response.DigitalAsset == null)
        {
            return new NotFoundObjectResult(request.DigitalAssetId);
        }

        return response;
    }

    [SwaggerOperation(
        Summary = "Get Digital Assets By Ids",
        Description = @"Get Digital Assets By Ids"
    )]
    [HttpGet("ids", Name = "getDigitalAssetsByIds")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetsByIdsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetsByIdsResponse>> GetDigitalAssetsByIds([FromQuery] GetDigitalAssetsByIdsRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

}


