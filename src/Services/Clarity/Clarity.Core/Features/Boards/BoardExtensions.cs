using Clarity.Core.Models;
using System.Linq;

namespace Clarity.Domain.Features
{
    public static class BoardExtensions
    {
        public static BoardDto ToDto(this Board board)
            => new()
        {
            BoardId = board.BoardId,
            Name = board.Name,
            States = board.BoardStates
                .OrderBy(x => x.Order)
                .Select(x => x.ToDto())
                .ToList()
        };
    }
}
