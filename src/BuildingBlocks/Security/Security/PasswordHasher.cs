// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Security;

public class PasswordHasher : IPasswordHasher
{
    public PasswordHasher()
    {

    }

    public string HashPassword(Byte[] salt, string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: password,
        salt: salt,
        prf: KeyDerivationPrf.HMACSHA1,
        iterationCount: 10000,
        numBytesRequested: 256 / 8));
    }
}

