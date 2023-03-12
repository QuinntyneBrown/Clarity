// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate;
using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.UserAggregate;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core;

public interface IClarityDbContext
{
    DbSet<Board> Boards { get; }
    DbSet<Comment> Comments { get; }
    DbSet<DigitalAsset> DigitalAssets { get; }
    DbSet<BoardState> BoardStates { get; }
    DbSet<TeamMember> TeamMembers { get; }
    DbSet<Ticket> Tickets { get; }
    DbSet<User> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

