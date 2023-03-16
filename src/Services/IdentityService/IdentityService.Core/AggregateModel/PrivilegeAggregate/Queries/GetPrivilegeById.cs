// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.PrivilegeAggregate.Queries;

public class GetPrivilegeByIdRequest : IRequest<GetPrivilegeByIdResponse>
{
    public Guid PrivilegeId { get; set; }
}


public class GetPrivilegeByIdResponse : ResponseBase
{
    public required PrivilegeDto Privilege { get; set; }
}


public class GetPrivilegeByIdRequestHandler : IRequestHandler<GetPrivilegeByIdRequest, GetPrivilegeByIdResponse>
{
    private readonly ILogger<GetPrivilegeByIdRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public GetPrivilegeByIdRequestHandler(ILogger<GetPrivilegeByIdRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetPrivilegeByIdResponse> Handle(GetPrivilegeByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Privilege = (await _context.Privileges.AsNoTracking().SingleOrDefaultAsync(x => x.PrivilegeId == request.PrivilegeId)).ToDto()
        };

    }

}



