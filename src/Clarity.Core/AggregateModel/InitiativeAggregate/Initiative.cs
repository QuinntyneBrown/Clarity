// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using System;
using System.Collections.Generic;

namespace Clarity.Core.AggregateModel.InitiativeAggregate;

public class Initiative
{
    public Guid InitiativeId { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public DateTime Created { get; private set; } = DateTime.UtcNow;
    public List<Ticket> Tickets { get; private set; } = new();
    public List<DigitalAsset> DigitalAssets { get; private set; } = new();

    public Initiative(string name, string description)
    {
        Name = name;
        Description = description;
    }

    private Initiative() { }

    public void Update(string name, string description)
    {
        Name = name;
        Description = description;
    }
}
