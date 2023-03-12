using System;
using System.Collections.Generic;

namespace Clarity.Core.AggregateModel
{
    public class BoardDto
    {
        public Guid BoardId { get; set; }
        public string Name { get; set; }
        public List<BoardStateDto> States { get; set; } = new();
    }
}
