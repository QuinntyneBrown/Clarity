// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Clarity.Core.AggregateModel.UserSettingsAggregate;

public class UserSettingsDto
{
    public Guid UserSettingsId { get; set; }
    public Guid UserId { get; set; }

    // Notification preferences
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool TicketUpdates { get; set; }
    public bool MentionAlerts { get; set; }
    public bool WeeklyDigest { get; set; }

    // Appearance preferences
    public string Theme { get; set; }
    public bool CompactMode { get; set; }
    public bool ShowAvatars { get; set; }

    // Language & Region preferences
    public string Language { get; set; }
    public string Timezone { get; set; }
    public string DateFormat { get; set; }
}
