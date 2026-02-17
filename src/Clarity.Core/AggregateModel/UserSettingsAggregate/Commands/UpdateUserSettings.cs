// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.UserSettingsAggregate.Commands;

public class UpdateUserSettingsRequestValidator : AbstractValidator<UpdateUserSettingsRequest> { }

public class UpdateUserSettingsRequest : IRequest<UpdateUserSettingsResponse>
{
    public Guid UserId { get; set; }
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool TicketUpdates { get; set; }
    public bool MentionAlerts { get; set; }
    public bool WeeklyDigest { get; set; }
    public string Theme { get; set; }
    public bool CompactMode { get; set; }
    public bool ShowAvatars { get; set; }
    public string Language { get; set; }
    public string Timezone { get; set; }
    public string DateFormat { get; set; }
}

public class UpdateUserSettingsResponse : ResponseBase
{
    public required UserSettingsDto UserSettings { get; set; }
}

public class UpdateUserSettingsRequestHandler : IRequestHandler<UpdateUserSettingsRequest, UpdateUserSettingsResponse>
{
    private readonly ILogger<UpdateUserSettingsRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public UpdateUserSettingsRequestHandler(ILogger<UpdateUserSettingsRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateUserSettingsResponse> Handle(UpdateUserSettingsRequest request, CancellationToken cancellationToken)
    {
        var settings = await _context.UserSettings
            .SingleOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);

        if (settings == null)
        {
            settings = new UserSettings { UserId = request.UserId };
            _context.UserSettings.Add(settings);
        }

        settings.EmailNotifications = request.EmailNotifications;
        settings.PushNotifications = request.PushNotifications;
        settings.TicketUpdates = request.TicketUpdates;
        settings.MentionAlerts = request.MentionAlerts;
        settings.WeeklyDigest = request.WeeklyDigest;
        settings.Theme = request.Theme;
        settings.CompactMode = request.CompactMode;
        settings.ShowAvatars = request.ShowAvatars;
        settings.Language = request.Language;
        settings.Timezone = request.Timezone;
        settings.DateFormat = request.DateFormat;

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            UserSettings = settings.ToDto()
        };
    }
}
