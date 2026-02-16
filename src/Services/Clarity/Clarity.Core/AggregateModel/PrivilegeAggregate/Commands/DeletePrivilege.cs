// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.PrivilegeAggregate.Commands;

public class DeletePrivilegeRequestValidator : AbstractValidator<DeletePrivilegeRequest> { }

public class DeletePrivilegeRequest : IRequest<DeletePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
}

public class DeletePrivilegeResponse : ResponseBase
{
    public PrivilegeDto Privilege { get; set; }
}

public class DeletePrivilegeRequestHandler : IRequestHandler<DeletePrivilegeRequest, DeletePrivilegeResponse>
{
    private readonly ILogger<DeletePrivilegeRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public DeletePrivilegeRequestHandler(ILogger<DeletePrivilegeRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeletePrivilegeResponse> Handle(DeletePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges.FindAsync(request.PrivilegeId);

        _context.Privileges.Remove(privilege);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Privilege = privilege.ToDto()
        };
    }
}
