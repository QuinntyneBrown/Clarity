// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Clarity.Core.AggregateModel.UserSettingsAggregate;

public static class UserSettingsExtensions
{
    public static UserSettingsDto ToDto(this UserSettings settings)
    {
        return new UserSettingsDto
        {
            UserSettingsId = settings.UserSettingsId,
            UserId = settings.UserId,
            EmailNotifications = settings.EmailNotifications,
            PushNotifications = settings.PushNotifications,
            TicketUpdates = settings.TicketUpdates,
            MentionAlerts = settings.MentionAlerts,
            WeeklyDigest = settings.WeeklyDigest,
            Theme = settings.Theme,
            CompactMode = settings.CompactMode,
            ShowAvatars = settings.ShowAvatars,
            Language = settings.Language,
            Timezone = settings.Timezone,
            DateFormat = settings.DateFormat
        };
    }
}
