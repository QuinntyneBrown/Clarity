// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace IdentityService.Core.AggregateModel.UserAggregate.Commands;

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.OldPassword).NotNull();
        RuleFor(x => x.NewPassword).NotNull();
    }
}

public class ChangePasswordRequest : IRequest<ChangePasswordResponse>
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}


public class ChangePasswordResponse : ResponseBase
{
    public string Token { get; set; }
}


public class ChangePasswordRequestHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
{
    private readonly ILogger<ChangePasswordRequestHandler> _logger;

    private readonly IIdentityServiceDbContext _context;

    public ChangePasswordRequestHandler(ILogger<ChangePasswordRequestHandler> logger, IIdentityServiceDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {

        throw new NotImplementedException();
    }

}



