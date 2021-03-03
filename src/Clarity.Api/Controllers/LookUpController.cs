using Clarity.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;

namespace Clarity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookUpController
    {
        [Authorize]
        [HttpGet("states",Name = "GetStatesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        public ActionResult<List<KeyValuePair<int, string>>> GetStates()
        {
            var results = new List<KeyValuePair<int, string>>();

            foreach (var type in Enum.GetValues<StateType>())
            {
                results.Add(new((int)type, type.ToString()));
            }

            return new OkObjectResult(new { 
                States = results
            });
        }
    }
}
