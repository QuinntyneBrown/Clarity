// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Security;
using SerilogTimings;

namespace IdentityService.Core.AggregateModel.UserAggregate.Commands;

public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest> 
{
    public AuthenticateRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().NotNull();
        RuleFor(x => x.Password).NotEmpty().NotNull();
    }

}

public class AuthenticateRequest : IRequest<AuthenticateResponse>
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}


public class AuthenticateResponse : ResponseBase
{
    public required string AccessToken { get; set; }
}


public class AuthenticateRequestHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
{
    private readonly ILogger<AuthenticateRequestHandler> _logger;
    private readonly IIdentityServiceDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenProvider _tokenProvider;

    public AuthenticateRequestHandler(
        ILogger<AuthenticateRequestHandler> logger,
        IIdentityServiceDbContext context,
        IPasswordHasher passwordHasher,
        ITokenProvider tokenProvider)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
        _tokenProvider = tokenProvider ?? throw new ArgumentNullException(nameof(tokenProvider));
    }

    public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {

        using (Operation.Time("Users.Authenticate"))
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
                throw new Exception();

            if (!ValidateUser(user, _passwordHasher.HashPassword(user.Salt, request.Password)))
                throw new Exception();

            var token = _tokenProvider.Get(user.Username);

            return new AuthenticateResponse
            {
                AccessToken = token
            };
        }

        bool ValidateUser(User user, string transformedPassword)
        {
            if (user == null || transformedPassword == null)
                return false;

            return user.Password == transformedPassword;
        }
    }
}
