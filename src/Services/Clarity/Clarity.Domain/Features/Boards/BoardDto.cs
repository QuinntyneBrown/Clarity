using System;
using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class BoardDto
    {
        public Guid BoardId { get; set; }
        public string Name { get; set; }
        public List<BoardStateDto> States { get; set; } = new();
    }
}
