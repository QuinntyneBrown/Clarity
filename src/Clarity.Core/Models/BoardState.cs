using System.Collections.Generic;

namespace Clarity.Core.Models
{
    public class BoardState
    {
        public BoardState()
        {

        }

        public BoardState(StateType type)
        {
            Type = type;
        }

        public int BoardStateId { get; set; }
        public int? BoardId { get; set; }
        public int Order { get; set; }
        public Board Board { get; set; }
        public StateType Type { get; set; }
        public ICollection<TicketState> TicketStates { get; set; }
        
    }
}
