// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.RoleAggregate;

namespace Clarity.Core.AggregateModel.UserAggregate;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string JobTitle { get; set; }
    public string AvatarUrl { get; set; }
    public List<RoleDto> Roles { get; set; }
}
