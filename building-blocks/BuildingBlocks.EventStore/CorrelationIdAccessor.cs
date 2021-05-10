using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;

namespace BuildingBlocks.EventStore
{
    public class CorrelationIdAccessor : ICorrelationIdAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CorrelationIdAccessor(IHttpContextAccessor httpContextAccessor)
            => _httpContextAccessor = httpContextAccessor;

        public Guid CorrelationId
        {
            get
            {
                if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null || _httpContextAccessor.HttpContext.Request.Headers["correlationId"] == default(StringValues))
                {
                    return Guid.NewGuid();
                }


                return new Guid(_httpContextAccessor.HttpContext.Request.Headers["correlationId"]);
            }
        }
    }
}
