// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.RoleAggregate.Commands;

public class DeleteRoleRequestValidator : AbstractValidator<DeleteRoleRequest> { }

public class DeleteRoleRequest : IRequest<DeleteRoleResponse>
{
    public Guid RoleId { get; set; }
}


public class DeleteRoleResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}


public class DeleteRoleRequestHandler : IRequestHandler<DeleteRoleRequest, DeleteRoleResponse>
{
    private readonly ILogger<DeleteRoleRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public DeleteRoleRequestHandler(ILogger<DeleteRoleRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeleteRoleResponse> Handle(DeleteRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FindAsync(request.RoleId);

        _context.Roles.Remove(role);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Role = role.ToDto()
        };
    }

}



