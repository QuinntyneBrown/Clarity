// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.RoleAggregate.Queries;

public class GetRoleByIdRequest : IRequest<GetRoleByIdResponse>
{
    public Guid RoleId { get; set; }
}

public class GetRoleByIdResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}

public class GetRoleByIdRequestHandler : IRequestHandler<GetRoleByIdRequest, GetRoleByIdResponse>
{
    private readonly ILogger<GetRoleByIdRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public GetRoleByIdRequestHandler(ILogger<GetRoleByIdRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetRoleByIdResponse> Handle(GetRoleByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Role = (await _context.Roles.AsNoTracking().SingleOrDefaultAsync(x => x.RoleId == request.RoleId)).ToDto()
        };
    }
}
