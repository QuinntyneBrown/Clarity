using Clarity.Core.Models;

namespace Clarity.Domain.Features
{
    public static class BoardStateExtensions
    {
        public static BoardStateDto ToDto(this BoardState boardState)
            => new BoardStateDto
            {
                
                StateId = boardState.BoardStateId,
                Order = boardState.Order,
                Type = boardState.Type
            };
    }
}
