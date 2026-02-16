// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Security;

namespace Clarity.Core.AggregateModel.PrivilegeAggregate.Commands;

public class UpdatePrivilegeRequestValidator : AbstractValidator<UpdatePrivilegeRequest>
{
    public UpdatePrivilegeRequestValidator()
    {
        RuleFor(x => x.PrivilegeId).NotNull();
        RuleFor(x => x.RoleId).NotNull();
        RuleFor(x => x.Aggregate).NotNull();
    }
}

public class UpdatePrivilegeRequest : IRequest<UpdatePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
    public Guid? RoleId { get; init; }
    public AccessRight AccessRight { get; init; }
    public string? Aggregate { get; init; }
}

public class UpdatePrivilegeResponse : ResponseBase
{
    public required PrivilegeDto Privilege { get; set; }
}

public class UpdatePrivilegeRequestHandler : IRequestHandler<UpdatePrivilegeRequest, UpdatePrivilegeResponse>
{
    private readonly ILogger<UpdatePrivilegeRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdatePrivilegeRequestHandler(ILogger<UpdatePrivilegeRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdatePrivilegeResponse> Handle(UpdatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges.SingleAsync(x => x.PrivilegeId == request.PrivilegeId);

        privilege.PrivilegeId = request.PrivilegeId;
        privilege.RoleId = request.RoleId;
        privilege.AccessRight = request.AccessRight;
        privilege.Aggregate = request.Aggregate;

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Privilege = privilege.ToDto()
        };
    }
}
