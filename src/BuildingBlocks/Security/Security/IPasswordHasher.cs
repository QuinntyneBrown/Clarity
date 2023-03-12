// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Security;

public interface IPasswordHasher
{
    string HashPassword(byte[] salt, string plainText);
}

