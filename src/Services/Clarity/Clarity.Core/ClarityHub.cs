// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Clarity.Core;

public class ClarityHub: Hub<IClarityHub>
{
    private readonly ILogger<ClarityHub> _logger;

    public ClarityHub(ILogger<ClarityHub> logger){
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
}


