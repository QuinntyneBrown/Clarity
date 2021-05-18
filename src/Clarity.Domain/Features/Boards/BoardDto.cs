using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class BoardDto
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public List<BoardStateDto> States { get; set; } = new();
    }
}
