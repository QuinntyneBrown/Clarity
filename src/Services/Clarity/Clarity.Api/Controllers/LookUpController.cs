// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Swashbuckle.AspNetCore.Annotations;
using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel;
using Microsoft.AspNetCore.Authorization;

namespace Clarity.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class LookUpController
{
    private readonly IMediator _mediator;

    private readonly ILogger<LookUpController> _logger;

    public LookUpController(IMediator mediator,ILogger<LookUpController> logger){
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("states", Name = "GetStatesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    public ActionResult<List<StateDto>> GetStates()
    {
        var results = new List<StateDto>();

        foreach (var type in Enum.GetValues<StateType>())
        {
            results.Add(new StateDto
            {
                Id = (int)type,
                Name = type.ToString(),
                DisplayName = ""
            });
        }

        return new OkObjectResult(new
        {
            States = results
        });
    }

}


