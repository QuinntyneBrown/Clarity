using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace BuildingBlocks.AspNetCore
{
    public static class HttpRequestExtensions
    {
        public static string GetAccessToken(this HttpRequest request, string scheme = "Bearer")
        {
            request.Headers.TryGetValue("Authorization", out StringValues value);

            if (StringValues.IsNullOrEmpty(value)) value = request.Query["access_token"];

            return value.ToString().Replace($"{scheme} ", "");
        }
    }
}
