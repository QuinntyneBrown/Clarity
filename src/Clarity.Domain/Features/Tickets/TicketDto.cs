using Clarity.Core.Models;
using System;
using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class TicketDto
    {
        public Guid TicketId { get; set; }
        public string Name { get; set; }
        public StateType State { get; set; } = StateType.Backlog;
        public Guid BoardStateId { get; set; }
        public string Url { get; set; }
        public int Age { get; set; }
        public string Description { get; set; }
        public string AcceptanceCriteria { get; set; }
        public Guid? BoardId { get; set; }
        public List<CommentDto> Comments { get; set; } = new ();
    }
}
