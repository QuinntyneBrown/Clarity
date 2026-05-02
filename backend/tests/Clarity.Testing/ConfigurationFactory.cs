// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.Configuration;
using System.IO;

namespace Clarity.Testing;

public static class ConfigurationFactory
{
    private static IConfiguration _configuration;

    public static IConfiguration Create()
    {
        if (_configuration == null)
        {
            var basePath = Path.GetFullPath("../../src/Services/Clarity/Clarity.Api");

            _configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", false)
                .AddUserSecrets<Program>()
                .Build();
        }

        return _configuration;
    }
}

