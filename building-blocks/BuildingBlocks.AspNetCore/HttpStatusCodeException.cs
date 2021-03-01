using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace BuildingBlocks.AspNetCore
{
    public class HttpStatusCodeException : Exception
    {
        public int StatusCode { get; set; }
        public string ContentType { get; set; } = @"text/plain";

        public HttpStatusCodeException(int statusCode)
        {
            this.StatusCode = statusCode;
        }

        public HttpStatusCodeException(int statusCode, string message) : base(message)
        {
            this.StatusCode = statusCode;
        }

        public HttpStatusCodeException(int statusCode, Exception inner) : this(statusCode, inner.ToString()) { }

        public HttpStatusCodeException(int statusCode, JObject errorObject) : this(statusCode, errorObject.ToString())
        {
            this.ContentType = @"application/json";
        }

        public HttpStatusCodeException(int statusCode, string type, string title, string detail) : this(statusCode, JsonConvert.SerializeObject(new ProblemDetails
        {
            Type = type,
            Status = statusCode,
            Title = title,
            Detail = detail
        }))
        {
            this.ContentType = @"application/json";
        }
    }
}
