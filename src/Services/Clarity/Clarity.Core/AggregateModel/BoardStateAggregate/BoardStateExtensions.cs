using Clarity.Core.AggregateModel.BoardStateAggregate;

namespace Clarity.Core.AggregateModel;

public static class BoardStateExtensions
{
    public static BoardStateDto ToDto(this BoardState boardState)
        => new()
        {
            StateId = boardState.BoardStateId,
            Order = boardState.Order,
            Type = boardState.Type
        };
}
