// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authorization;

namespace Security;

[System.AttributeUsage(System.AttributeTargets.Class | System.AttributeTargets.Struct)]
public class AuthorizeResourceOperationAttribute : System.Attribute
{
    public string Resource;
    public string Operation { get; set; }

    public AuthorizeResourceOperationAttribute(string operation, string resource)
    {
        Operation = operation;
        Resource = resource;
    }

    public IAuthorizationRequirement Requirement => Operation switch
    {
        nameof(Operations.Create) => Operations.Create,
        nameof(Operations.Read) => Operations.Read,
        nameof(Operations.Write) => Operations.Write,
        nameof(Operations.Delete) => Operations.Delete,
        _ => null,
    };
}

