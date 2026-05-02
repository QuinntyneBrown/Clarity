// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.RoleAggregate;
using Security;
using System.Security.Cryptography;

namespace Clarity.Core.AggregateModel.UserAggregate;

public class User
{
    public User()
    {
    }

    public User(string username)
    {
        Roles = new List<Role>();
        Username = username;
        Salt = new byte[128 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(Salt);
        }
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

    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public byte[] Salt { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string JobTitle { get; set; }
    public string AvatarUrl { get; set; }
    public List<Role> Roles { get; set; }

    public User SetPassword(string password)
    {
        Password = new PasswordHasher().HashPassword(Salt, password);
        return this;
    }
}
