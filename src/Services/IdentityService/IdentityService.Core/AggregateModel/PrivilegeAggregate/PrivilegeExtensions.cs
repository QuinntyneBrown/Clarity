// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.PrivilegeAggregate;

public static class PrivilegeExtensions
{
    public static PrivilegeDto ToDto(this Privilege privilege)
    {
        return new PrivilegeDto
        {
            PrivilegeId = privilege.PrivilegeId,
            RoleId = privilege.RoleId,
            AccessRight = privilege.AccessRight,
            Aggregate = privilege.Aggregate
        };

    }

    public async static Task<List<PrivilegeDto>> ToDtosAsync(this IQueryable<Privilege> privileges, CancellationToken cancellationToken)
    {
        return await privileges.Select(x => x.ToDto()).ToListAsync(cancellationToken);
    }

}


