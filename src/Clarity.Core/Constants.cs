// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Clarity.Core;

public class Constants
{
    public static class BoardStates
    {
        public static readonly string Backlog = nameof(Backlog);
        public static readonly string InProgress = nameof(InProgress);
        public static readonly string Done = nameof(Done);
    }

    public static class ClaimTypes
    {
        public static readonly string UserId = nameof(UserId);
        public static readonly string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    }
}

