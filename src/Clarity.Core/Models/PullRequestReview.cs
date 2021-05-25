using System;

namespace Clarity.Core.Models
{
    public class PullRequestReview
    {
        public Guid PullRequestReviewedId { get; private set; }
        public Guid PullRequestId { get; private set; }
        public Guid ReviewerId { get; private set; }
        public TeamMember Reviewer { get; private set; }
        public PullRequest PullRequest { get; set; }
    }
}
