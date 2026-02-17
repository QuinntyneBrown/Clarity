// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.UserAggregate.Commands;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public class UpdateUserRequest : IRequest<UpdateUserResponse>
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string JobTitle { get; set; }
    public string AvatarUrl { get; set; }
}

public class UpdateUserResponse : ResponseBase
{
    public required UserDto User { get; set; }
}

public class UpdateUserRequestHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly ILogger<UpdateUserRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdateUserRequestHandler(ILogger<UpdateUserRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleAsync(x => x.UserId == request.UserId);

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.Phone = request.Phone;
        user.JobTitle = request.JobTitle;
        user.AvatarUrl = request.AvatarUrl;

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            User = user.ToDto()
        };
    }
}
