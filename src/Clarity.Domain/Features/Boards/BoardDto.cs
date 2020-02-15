using Clarity.Domain.Features.States;
using System;
using System.Collections.Generic;

namespace Clarity.Domain.Features.Boards
{
    public class BoardDto
    {        
        public int BoardId { get; set; }
        public string Name { get; set; }
        public ICollection<StateDto> States { get; set; } 
            = new HashSet<StateDto>();
    }
}
