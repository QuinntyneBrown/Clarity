using System;

namespace Clarity.Core.Models
{
    public class PullRequest
    {
        public Guid PullRequestId { get; private set; }
        public string Url { get; private set; }
        public string TicketName { get; private set; }
    }
}
