// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Http;

namespace IdentityService.Core.AggregateModel.UserAggregate.Queries;

public class GetCurrentUserRequest : IRequest<GetCurrentUserResponse> { }

public class GetCurrentUserResponse : ResponseBase
{
    public required UserDto User { get; set; }
}

public class GetCurrentUserRequestHandler : IRequestHandler<GetCurrentUserRequest, GetCurrentUserResponse>
{
    private readonly ILogger<GetCurrentUserRequestHandler> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIdentityServiceDbContext _context;

    public GetCurrentUserRequestHandler(
        ILogger<GetCurrentUserRequestHandler> logger,
        IHttpContextAccessor httpContextAccessor,
        IIdentityServiceDbContext context)
    {

        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetCurrentUserResponse> Handle(GetCurrentUserRequest request, CancellationToken cancellationToken)
    {
        var name = _httpContextAccessor.HttpContext!.User.Identity!.Name;

        return new()
        {
            User = (await _context.Users.Where(x => x.Username == name).SingleAsync()).ToDto()
        };
    }

}



