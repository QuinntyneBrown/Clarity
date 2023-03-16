// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Security;

namespace IdentityService.Core.AggregateModel.PrivilegeAggregate;

public class PrivilegeDto
{
    public Guid PrivilegeId { get; set; }
    public Guid? RoleId { get; init; }
    public AccessRight AccessRight { get; init; }
    public string? Aggregate { get; init; }
}


