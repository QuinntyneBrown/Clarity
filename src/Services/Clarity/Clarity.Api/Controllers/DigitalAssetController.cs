using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Clarity.Domain.Features;

namespace Clarity.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DigitalAssetController
    {
        private readonly IMediator _mediator;

        public DigitalAssetController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<ActionResult<SaveDigitalAsset.Response>> Save(SaveDigitalAsset.Request request)
            => await _mediator.Send(request);

        [HttpGet("range")]
        public async Task<ActionResult<GetDigitalAssetsByIds.Response>> GetByIds([FromQuery] GetDigitalAssetsByIds.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{digitalAssetId}")]
        public async Task Remove(RemoveDigitalAsset.Request request)
            => await _mediator.Send(request);

        [HttpGet("{digitalAssetId}")]
        public async Task<ActionResult<GetDigitalAssetById.Response>> GetById([FromRoute] GetDigitalAssetById.Request request)
            => await _mediator.Send(request);

/*        [HttpPost("upload"), DisableRequestSizeLimit]
        public async Task<ActionResult<UploadDigitalAsset.Response>> Save()
            => await _mediator.Send(new UploadDigitalAsset.Request());*/

        [AllowAnonymous]
        [HttpGet("serve/{digitalAssetId}")]
        public async Task<IActionResult> Serve([FromRoute] GetDigitalAssetById.Request request)
        {
            var response = await _mediator.Send(request);
            return new FileContentResult(response.DigitalAsset.Bytes, response.DigitalAsset.ContentType);
        }

        [HttpGet]
        public async Task<ActionResult<GetDigitalAssets.Response>> Get()
            => await _mediator.Send(new GetDigitalAssets.Request());
    }
}
