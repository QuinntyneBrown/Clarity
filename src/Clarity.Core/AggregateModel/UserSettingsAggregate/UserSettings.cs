// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;

namespace Clarity.Core.AggregateModel.UserSettingsAggregate;

public class UserSettings
{
    public Guid UserSettingsId { get; set; }
    public Guid UserId { get; set; }

    // Notification preferences
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool TicketUpdates { get; set; } = true;
    public bool MentionAlerts { get; set; } = true;
    public bool WeeklyDigest { get; set; }

    // Appearance preferences
    public string Theme { get; set; } = "light";
    public bool CompactMode { get; set; }
    public bool ShowAvatars { get; set; } = true;

    // Language & Region preferences
    public string Language { get; set; } = "en";
    public string Timezone { get; set; } = "America/New_York";
    public string DateFormat { get; set; } = "MM/DD/YYYY";

    public User User { get; set; }
}
