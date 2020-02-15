using System.Collections.Generic;

namespace Clarity.Core.Models
{
    public class Board
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public ICollection<State> States { get; set; } = new HashSet<State>();
    }
}
