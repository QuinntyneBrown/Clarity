// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.RoleAggregate.Commands;

public class UpdateRoleRequestValidator : AbstractValidator<UpdateRoleRequest>
{
    public UpdateRoleRequestValidator()
    {
        RuleFor(x => x.RoleId).NotNull().NotEmpty();
        RuleFor(x => x.Name).NotNull().NotEmpty();
    }
}

public class UpdateRoleRequest : IRequest<UpdateRoleResponse>
{
    public Guid RoleId { get; set; }
    public required string Name { get; set; }
}

public class UpdateRoleResponse : ResponseBase
{
    public required RoleDto Role { get; set; }
}

public class UpdateRoleRequestHandler : IRequestHandler<UpdateRoleRequest, UpdateRoleResponse>
{
    private readonly ILogger<UpdateRoleRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdateRoleRequestHandler(ILogger<UpdateRoleRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateRoleResponse> Handle(UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.SingleAsync(x => x.RoleId == request.RoleId);

        role.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Role = role.ToDto()
        };
    }
}
