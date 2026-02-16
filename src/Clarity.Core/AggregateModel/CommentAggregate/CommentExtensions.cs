// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.CommentAggregate;

namespace Clarity.Core.AggregateModel;

public static class CommentExtensions
{
    public static CommentDto ToDto(this Comment comment)
        => new()
        {
            CommentId = comment.CommentId,
            Description = comment.Description,
            Created = comment.Created,
            TicketId = comment.TicketId,
            TeamMemberId = comment.TeamMemberId
        };
}

