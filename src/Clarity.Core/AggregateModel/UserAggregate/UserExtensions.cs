// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.RoleAggregate;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.UserAggregate;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Roles = user.Roles?.Select(x => new RoleDto { RoleId = x.RoleId, Name = x.Name }).ToList() ?? new List<RoleDto>()
        };
    }

    public static async Task<List<UserDto>> ToDtosAsync(this IQueryable<User> users, CancellationToken cancellationToken)
    {
        return await users.Select(x => x.ToDto()).ToListAsync(cancellationToken);
    }

    public static List<UserDto> ToDtos(this IEnumerable<User> users)
    {
        return users.Select(x => x.ToDto()).ToList();
    }
}
