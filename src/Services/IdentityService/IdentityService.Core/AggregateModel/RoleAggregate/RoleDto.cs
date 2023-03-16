// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using IdentityService.Core.AggregateModel.PrivilegeAggregate;
using IdentityService.Core.AggregateModel.UserAggregate;

namespace IdentityService.Core.AggregateModel.RoleAggregate;

public class RoleDto
{
    public Guid RoleId { get; set; }
    public string Name { get; set; }
    public List<UserDto> Users { get; set; }
    public List<PrivilegeDto> Privileges { get; set; }
}


