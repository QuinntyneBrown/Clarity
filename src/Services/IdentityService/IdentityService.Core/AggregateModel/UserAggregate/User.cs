// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using IdentityService.Core.AggregateModel.RoleAggregate;
using Security;
using System.Security.Cryptography;

namespace IdentityService.Core.AggregateModel.UserAggregate;
public class User
{
    public User()
    {

    }

    public User(string username, string password, IPasswordHasher passwordHasher)
    {
        Roles = new List<Role>();
        Salt = new byte[128 / 8];
        using (var randomNumberGenerator = RandomNumberGenerator.Create())
        {
            randomNumberGenerator.GetBytes(Salt);
        }
        Username = username;
        Password = passwordHasher.HashPassword(Salt, password);
    }

    public Guid UserId { get; init; }
    public string Username { get; init; }
    public string Password { get; init; }
    public byte[] Salt { get; init; }
    public List<Role> Roles { get; init; }
}