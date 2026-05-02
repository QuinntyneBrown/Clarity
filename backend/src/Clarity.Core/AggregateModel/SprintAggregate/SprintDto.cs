// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Clarity.Core.AggregateModel;

public class SprintDto
{
    public Guid SprintId { get; set; }
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public Guid TeamId { get; set; }
}
