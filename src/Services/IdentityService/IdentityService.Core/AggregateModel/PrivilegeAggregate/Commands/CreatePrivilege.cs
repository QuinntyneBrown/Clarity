// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Security;

namespace IdentityService.Core.AggregateModel.PrivilegeAggregate.Commands;

public class CreatePrivilegeRequestValidator : AbstractValidator<CreatePrivilegeRequest> { }

public class CreatePrivilegeRequest : IRequest<CreatePrivilegeResponse>
{
    public Guid? RoleId { get; init; }
    public AccessRight AccessRight { get; init; }
    public string? Aggregate { get; init; }
}


public class CreatePrivilegeResponse : ResponseBase
{
    public required PrivilegeDto Privilege { get; set; }
}


public class CreatePrivilegeRequestHandler : IRequestHandler<CreatePrivilegeRequest, CreatePrivilegeResponse>
{
    private readonly ILogger<CreatePrivilegeRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public CreatePrivilegeRequestHandler(ILogger<CreatePrivilegeRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<CreatePrivilegeResponse> Handle(CreatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = new Privilege()
        {
            RoleId = request.RoleId,
            AccessRight = request.AccessRight,
            Aggregate = request.Aggregate,
        };

        _context.Privileges.Add(privilege);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Privilege = privilege.ToDto()
        };
    }
}