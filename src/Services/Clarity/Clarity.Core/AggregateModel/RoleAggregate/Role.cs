// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.PrivilegeAggregate;
using Clarity.Core.AggregateModel.UserAggregate;

namespace Clarity.Core.AggregateModel.RoleAggregate;

public class Role
{
    public Guid RoleId { get; set; }
    public string Name { get; set; }
    public List<User> Users { get; set; }
    public List<Privilege> Privileges { get; set; }
}
