using Clarity.Core.Models;

namespace Clarity.Testing.Builders
{
    public class BoardBuilder
    {
        private Board _board;

        public static Board WithDefaults()
        {
            return new Board();
        }

        public BoardBuilder()
        {
            _board = WithDefaults();
        }

        public Board Build()
        {
            return _board;
        }
    }
}
