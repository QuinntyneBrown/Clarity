// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.UserAggregate.Queries;

public class GetUsersRequest : IRequest<GetUsersResponse> { }

public class GetUsersResponse : ResponseBase
{
    public List<UserDto> Users { get; set; }
}

public class GetUsersRequestHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly ILogger<GetUsersRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public GetUsersRequestHandler(ILogger<GetUsersRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Users = await _context.Users.AsNoTracking().Select(x => x.ToDto()).ToListAsync(cancellationToken)
        };
    }
}
