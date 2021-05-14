using Clarity.Core.Models;
using Clarity.Domain.Features;

namespace Clarity.Testing.Builders
{
    public class CommentDtoBuilder
    {
        private CommentDto _commentDto;

        public static CommentDto WithDefaults()
        {
            return new CommentDto();
        }

        public CommentDtoBuilder()
        {
            _commentDto = WithDefaults();
        }

        public CommentDto Build()
        {
            return _commentDto;
        }
    }
}
