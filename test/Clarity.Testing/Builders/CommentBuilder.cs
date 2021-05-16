using Clarity.Core.Models;

namespace Clarity.Testing.Builders
{
    public class CommentBuilder
    {
        private Comment _comment;

        public static Comment WithDefaults()
        {
            return new Comment(default, default);
        }

        public CommentBuilder()
        {
            _comment = WithDefaults();
        }

        public Comment Build()
        {
            return _comment;
        }
    }
}
