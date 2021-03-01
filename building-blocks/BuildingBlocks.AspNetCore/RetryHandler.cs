using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;

namespace BuildingBlocks.AspNetCore
{
    public class RetryHandler : DelegatingHandler
    {
        private readonly ILogger<RetryHandler> _logger;
        private HttpRequestMessage _request;
        private CancellationToken _cancellationToken;
        public RetryHandler(ILogger<RetryHandler> logger)
        {
            _logger = logger;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            _request = request;
            _cancellationToken = cancellationToken;

            Context context = new Polly.Context {
                { "retrycount", 0}
            };

            return Policy
                .Handle<HttpRequestException>()
                .WaitAndRetryAsync(5, (n) => TimeSpan.FromSeconds(n), (Action<Exception, TimeSpan, int, Context>)LogFailure)
                .ExecuteAsync(() => ((Func<Context, Task<HttpResponseMessage>>)ExecuteAsync)(context));

        }

        private async Task<HttpResponseMessage> ExecuteAsync(Context context)
        {

            if (context.TryGetValue("retrycount", out var retryObject) && retryObject is int retries)
            {
                retries++;
                context["retrycount"] = retries;
            }

            var response = await base.SendAsync(_request, _cancellationToken);
            response.EnsureSuccessStatusCode();
            response.Headers.Add("X-Retry-Count", $"{context["retrycount"]}");
            return response;
        }

        private void LogFailure(Exception exception, TimeSpan waitTime, int retryCount, Context context)
        {
            _logger.LogWarning("Retrying again after {WaitTime} - count: {RetryCount}", waitTime, retryCount);
        }
    }
}
