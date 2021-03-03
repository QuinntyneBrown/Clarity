using System;
using System.Collections.Generic;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Board
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public ICollection<BoardState> BoardStates { get; set; } = new HashSet<BoardState>();
        public static Board WithDefaults(string name)
        {
            Board board = new() { Name = name };

            foreach (var state in Enum.GetValues<StateType>().Select(x => new BoardState(x)).ToList())
            {
                board.BoardStates.Add(state);
            };

            return board;
        }
    }
}
