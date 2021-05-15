using System.Collections.Generic;

namespace Clarity.Core.Models
{
    public class BoardState
    {
        public int BoardStateId { get; private set; }
        public int? BoardId { get; private set; }
        public int Order { get; private set; }
        public Board Board { get; private set; }
        public StateType Type { get; private set; }
        public List<TicketState> TicketStates { get; private set; } = new ();
        private BoardState()
        {

        }

        public BoardState(StateType type, int order, int boardId)
        {
            Type = type;
            Order = order;
            BoardId = boardId;
        }
    }
}
