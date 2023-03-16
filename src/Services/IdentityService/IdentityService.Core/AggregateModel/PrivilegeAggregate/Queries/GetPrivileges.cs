// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.PrivilegeAggregate.Queries;

public class GetPrivilegesRequest : IRequest<GetPrivilegesResponse> { }

public class GetPrivilegesResponse : ResponseBase
{
    public required List<PrivilegeDto> Privileges { get; set; }
}


public class GetPrivilegesRequestHandler : IRequestHandler<GetPrivilegesRequest, GetPrivilegesResponse>
{
    private readonly ILogger<GetPrivilegesRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public GetPrivilegesRequestHandler(ILogger<GetPrivilegesRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetPrivilegesResponse> Handle(GetPrivilegesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Privileges = await _context.Privileges.AsNoTracking().ToDtosAsync(cancellationToken)
        };

    }

}



