using Clarity.Core.AggregateModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using Clarity.Core.AggregateModel.BoardStateAggregate;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookUpController
    {
        [Authorize]
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
}
