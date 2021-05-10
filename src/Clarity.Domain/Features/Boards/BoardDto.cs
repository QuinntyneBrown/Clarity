using Clarity.Domain.Features;
using System;
using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class BoardDto
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public ICollection<BoardStateDto> States { get; set; }
            = new HashSet<BoardStateDto>();
    }
}
