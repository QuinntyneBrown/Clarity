using System;
using System.Collections.Generic;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Board
    {
        public int BoardId { get; private set; }
        public string Name { get; private set; }
        public ICollection<BoardState> BoardStates { get; private set; } = new HashSet<BoardState>();
        public static Board WithDefaults(string name)
        {
            Board board = new() { Name = name };

            foreach (var state in Enum.GetValues<StateType>().Select(x => new BoardState(x)).ToList())
            {
                board.BoardStates.Add(state);
            };

            return board;
        }

        public Board(string name)
        {
            Name = name;
        }

        private Board()
        {

        }
    }
}
