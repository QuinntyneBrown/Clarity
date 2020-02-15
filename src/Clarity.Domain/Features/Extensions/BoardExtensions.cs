using Clarity.Core.Models;
using Clarity.Domain.Features.Boards;
using System.Linq;

namespace Clarity.Domain.Features.Extensions
{
    public static class BoardExtensions
    {
        public static BoardDto ToDto(this Board board)
            => new BoardDto
            {
                BoardId = board.BoardId,
                Name = board.Name,
                States = board.States.Select(x => x.ToDto()).ToList()
            };
    }
}
