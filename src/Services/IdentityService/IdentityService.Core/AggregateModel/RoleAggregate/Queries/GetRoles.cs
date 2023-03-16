// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.RoleAggregate.Queries;

public class GetRolesRequest : IRequest<GetRolesResponse> { }

public class GetRolesResponse : ResponseBase
{
    public List<RoleDto> Roles { get; set; }
}


public class GetRolesRequestHandler : IRequestHandler<GetRolesRequest, GetRolesResponse>
{
    private readonly ILogger<GetRolesRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public GetRolesRequestHandler(ILogger<GetRolesRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetRolesResponse> Handle(GetRolesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Roles = await _context.Roles.AsNoTracking().ToDtosAsync(cancellationToken)
        };

    }

}



