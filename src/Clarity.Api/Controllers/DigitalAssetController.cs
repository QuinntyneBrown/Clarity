// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.DigitalAssetAggregate.Commands;
using Clarity.Core.AggregateModel.DigitalAssetAggregate.Queries;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Http;
using System;

namespace Clarity.Api.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class DigitalAssetController
{
    private readonly IMediator _mediator;
    private readonly ILogger<DigitalAssetController> _logger;

    public DigitalAssetController(IMediator mediator, ILogger<DigitalAssetController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [SwaggerOperation(Summary = "Get Digital Assets")]
    [HttpGet(Name = "getDigitalAssets")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetsResponse>> Get(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetDigitalAssetsRequest(), cancellationToken);
    }

    [SwaggerOperation(Summary = "Get DigitalAsset by id")]
    [HttpGet("{digitalAssetId:guid}", Name = "getDigitalAssetById")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetByIdResponse>> GetById([FromRoute] Guid digitalAssetId, CancellationToken cancellationToken)
    {
        var request = new GetDigitalAssetByIdRequest() { DigitalAssetId = digitalAssetId };
        var response = await _mediator.Send(request, cancellationToken);

        if (response.DigitalAsset == null)
            return new NotFoundObjectResult(request.DigitalAssetId);

        return response;
    }

    [SwaggerOperation(Summary = "Get Digital Assets By Ids")]
    [HttpGet("ids", Name = "getDigitalAssetsByIds")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDigitalAssetsByIdsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDigitalAssetsByIdsResponse>> GetDigitalAssetsByIds([FromQuery] GetDigitalAssetsByIdsRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(Summary = "Upload a Digital Asset")]
    [HttpPost("upload", Name = "uploadDigitalAsset")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UploadDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UploadDigitalAssetResponse>> Upload([FromForm] UploadDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(Summary = "Update a Digital Asset")]
    [HttpPut("{digitalAssetId:guid}", Name = "updateDigitalAsset")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateDigitalAssetResponse>> Update([FromRoute] Guid digitalAssetId, [FromForm] UpdateDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        request.DigitalAssetId = digitalAssetId;
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(Summary = "Update Digital Asset Content (text)")]
    [HttpPut("{digitalAssetId:guid}/content", Name = "updateDigitalAssetContent")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateDigitalAssetContentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateDigitalAssetContentResponse>> UpdateContent([FromRoute] Guid digitalAssetId, [FromBody] UpdateDigitalAssetContentRequest request, CancellationToken cancellationToken)
    {
        request.DigitalAssetId = digitalAssetId;
        return await _mediator.Send(request, cancellationToken);
    }

    [SwaggerOperation(Summary = "Delete a Digital Asset")]
    [HttpDelete("{digitalAssetId:guid}", Name = "removeDigitalAsset")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveDigitalAssetResponse>> Remove([FromRoute] Guid digitalAssetId, CancellationToken cancellationToken)
    {
        return await _mediator.Send(new RemoveDigitalAssetRequest() { DigitalAssetId = digitalAssetId }, cancellationToken);
    }

    [SwaggerOperation(Summary = "Serve Digital Asset file")]
    [HttpGet("serve/{digitalAssetId:guid}", Name = "serveDigitalAsset")]
    [AllowAnonymous]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<IActionResult> Serve([FromRoute] Guid digitalAssetId, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetDigitalAssetByIdRequest() { DigitalAssetId = digitalAssetId }, cancellationToken);

        if (response.DigitalAsset == null || response.DigitalAsset.Bytes == null)
            return new NotFoundResult();

        return new FileContentResult(response.DigitalAsset.Bytes, response.DigitalAsset.ContentType ?? "application/octet-stream")
        {
            FileDownloadName = response.DigitalAsset.Name
        };
    }
}
