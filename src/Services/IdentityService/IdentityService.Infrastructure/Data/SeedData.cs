using IdentityService.Core.AggregateModel.UserAggregate;
using Security;

namespace IdentityService.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(this IdentityServiceDbContext context)
    {
        if (context.Users.SingleOrDefault(x => x.Username == "quinntynebrown@gmail.com") == null)
        {
            var passwordHasher = new PasswordHasher();

            context.Users.Add(new User("quinntynebrown@gmail.com", "P@ssw0rd", passwordHasher));

            context.SaveChanges();
        }
    }
}
