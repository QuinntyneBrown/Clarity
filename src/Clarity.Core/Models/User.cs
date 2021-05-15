using BuildingBlocks.Core;
using System.Security.Cryptography;

namespace Clarity.Core.Models
{
    public class User
    {
        public int UserId { get; private set; }
        public string Username { get; private set; }
        public string Password { get; private set; }
        public byte[] Salt { get; private set; }

        public User(string username)
        {
            Username = username;
            Salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(Salt);
            }
        }

        private User()
        {

        }

        public User SetPassword(string password)
        {
            Password = new PasswordHasher().HashPassword(Salt, password);
            return this;
        }
    }
}
