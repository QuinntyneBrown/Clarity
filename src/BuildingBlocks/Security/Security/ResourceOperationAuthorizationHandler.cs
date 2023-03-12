// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Linq;
using System.Threading.Tasks;

namespace Security;

public class ResourceOperationAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, object>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, object resource)
    {
        try
        {
            var resourceName = resource as string;
            var claim = context.User.Claims.SingleOrDefault(x => x.Type == SecurityConstants.ClaimTypes.Privilege && x.Value == $"{requirement.Name}{resourceName}");
            if (claim != null)
            {
                context.Succeed(requirement);
            }
        }
        catch
        {

        }

        await Task.CompletedTask;
    }
}

