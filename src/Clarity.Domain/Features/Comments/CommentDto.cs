﻿using Clarity.Domain.Features.TeamMembers;
using System;

namespace Clarity.Domain.Features.Comments
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public int? TicketId { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public int TeamMemberId { get; set; }
        public TeamMemberDto TeamMember { get; set; }
    }
}