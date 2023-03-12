// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using static Security.SecurityConstants;
using System.Collections.Generic;

namespace Security;

public static class SecurityConstants
{
    public static class ClaimTypes
    {
        public static readonly string UserId = nameof(UserId);
        public static readonly string Privilege = nameof(Privilege);
        public static readonly string Username = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        public static readonly string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    }

    public static class AccessRights
    {
        public static List<AccessRight> Read => new() { AccessRight.Read };
        public static List<AccessRight> ReadWrite => new() { AccessRight.Read, AccessRight.Write };
        public static List<AccessRight> FullAccess => new() { AccessRight.Read, AccessRight.Write, AccessRight.Create, AccessRight.Delete };
    }
}

