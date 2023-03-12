// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Clarity.Testing
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

