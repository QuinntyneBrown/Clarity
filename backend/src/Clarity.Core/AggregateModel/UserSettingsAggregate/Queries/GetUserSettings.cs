// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Kernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.UserSettingsAggregate.Queries;

public class GetUserSettingsRequest : IRequest<GetUserSettingsResponse>
{
    public Guid UserId { get; set; }
}

public class GetUserSettingsResponse : ResponseBase
{
    public required UserSettingsDto UserSettings { get; set; }
}

public class GetUserSettingsRequestHandler : IRequestHandler<GetUserSettingsRequest, GetUserSettingsResponse>
{
    private readonly ILogger<GetUserSettingsRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public GetUserSettingsRequestHandler(ILogger<GetUserSettingsRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<GetUserSettingsResponse> Handle(GetUserSettingsRequest request, CancellationToken cancellationToken)
    {
        var settings = await _context.UserSettings
            .SingleOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);

        if (settings == null)
        {
            settings = new UserSettings { UserId = request.UserId };
            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new()
        {
            UserSettings = settings.ToDto()
        };
    }
}
