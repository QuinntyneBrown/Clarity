// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Security;

namespace Clarity.Core.AggregateModel.UserAggregate.Commands;

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.OldPassword).NotNull().NotEmpty();
        RuleFor(x => x.NewPassword).NotNull().NotEmpty().MinimumLength(6);
    }
}

public class ChangePasswordRequest : IRequest<ChangePasswordResponse>
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}

public class ChangePasswordResponse : ResponseBase
{
    public bool Success { get; set; }
}

public class ChangePasswordRequestHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
{
    private readonly ILogger<ChangePasswordRequestHandler> _logger;
    private readonly IClarityDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPasswordHasher _passwordHasher;

    public ChangePasswordRequestHandler(
        ILogger<ChangePasswordRequestHandler> logger,
        IClarityDbContext context,
        IHttpContextAccessor httpContextAccessor,
        IPasswordHasher passwordHasher)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
    }

    public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var name = _httpContextAccessor.HttpContext!.User.Identity!.Name;
        var user = await _context.Users.SingleAsync(x => x.Username == name, cancellationToken);

        var oldPasswordHash = _passwordHasher.HashPassword(user.Salt, request.OldPassword);

        if (user.Password != oldPasswordHash)
        {
            return new() { Success = false, Errors = new List<string> { "Current password is incorrect." } };
        }

        user.SetPassword(request.NewPassword);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Success = true };
    }
}
