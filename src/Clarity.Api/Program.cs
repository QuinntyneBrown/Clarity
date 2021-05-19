using Clarity.Core.Data;
using Clarity.Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Security.Cryptography;

namespace Clarity.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            ProcessDbCommands(args, host);

            host.Run();
        }

        private static void ProcessDbCommands(string[] args, IHost host)
        {
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));

            using (var scope = services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ClarityContext>();
                var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

                if (args.Contains("ci"))
                    args = new string[4] { "dropdb", "migratedb", "seeddb", "stop" };

                if (args.Contains("dropdb"))
                {
                    context.Database.EnsureDeleted();
                }

                if (args.Contains("migratedb"))
                {
                    context.Database.Migrate();
                }

                if (args.Contains("seeddb"))
                {
                    context.Database.EnsureCreated();

                    //SeedData.Seed(context);
                }

                if (args.Contains("secret"))
                {
                    var tripleDESCryptoServiceProvider = new TripleDESCryptoServiceProvider();
                    tripleDESCryptoServiceProvider.GenerateKey();
                    var key = Convert.ToBase64String(tripleDESCryptoServiceProvider.Key);
                    Console.WriteLine(key);
                    Environment.Exit(0);
                }

                if (args.Contains("stop"))
                    Environment.Exit(0);
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}

