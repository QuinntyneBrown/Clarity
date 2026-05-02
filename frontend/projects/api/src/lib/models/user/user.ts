// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export type User = {
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  avatarUrl?: string;
};

export type UserSettings = {
  userSettingsId?: string;
  userId?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  ticketUpdates?: boolean;
  mentionAlerts?: boolean;
  weeklyDigest?: boolean;
  theme?: string;
  compactMode?: boolean;
  showAvatars?: boolean;
  language?: string;
  timezone?: string;
  dateFormat?: string;
};
