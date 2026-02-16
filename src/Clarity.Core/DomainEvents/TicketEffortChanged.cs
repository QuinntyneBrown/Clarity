// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using System;

namespace Clarity.Core.DomainEvents;

[Owned]
public record TicketEffortChanged(int Effort, DateTime Changed);

