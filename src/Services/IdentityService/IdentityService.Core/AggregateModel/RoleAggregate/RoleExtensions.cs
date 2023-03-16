// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.RoleAggregate;

public static class RoleExtensions
{
    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name,
            //Users = role.Users,
            //Privileges = role.Privileges,
        };

    }

    public async static Task<List<RoleDto>> ToDtosAsync(this IQueryable<Role> roles, CancellationToken cancellationToken)
    {
        return await roles.Select(x => x.ToDto()).ToListAsync(cancellationToken);
    }

}


