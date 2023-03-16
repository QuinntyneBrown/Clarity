// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using IdentityService.Core.AggregateModel.PrivilegeAggregate;
using IdentityService.Core.AggregateModel.RoleAggregate;
using IdentityService.Core.AggregateModel.UserAggregate;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Core;

public interface IIdentityServiceDbContext
{
    public DbSet<Privilege> Privileges { get; }
    public DbSet<Role> Roles { get; }
    public DbSet<User> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

}
