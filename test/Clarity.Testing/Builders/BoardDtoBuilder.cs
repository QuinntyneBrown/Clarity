using Clarity.Domain.Features;

namespace Clarity.Testing.Builders
{
    public class BoardDtoBuilder
    {
        private BoardDto _boardDto;

        public static BoardDto WithDefaults()
        {
            return new BoardDto();
        }

        public BoardDtoBuilder()
        {
            _boardDto = WithDefaults();
        }

        public BoardDto Build()
        {
            return _boardDto;
        }
    }
}
