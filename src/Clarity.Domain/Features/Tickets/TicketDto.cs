using Clarity.Domain.Features.Comments;
using System.Collections.Generic;

namespace Clarity.Domain.Features.Tickets
{
    public class TicketDto
    {
        public int TicketId { get; set; }
        public string Name { get; set; }
        public string State { get; set; }
        public int StateId { get; set; }
        public string Url { get; set; }
        public int Age { get; set; }
        public string Description { get; set; }
        public string AcceptanceCriteria { get; set; }
        public int? BoardId { get; set; }

        public ICollection<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }
}
