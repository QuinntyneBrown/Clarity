using Clarity.Core.Models;
using Clarity.Domain.Features.States;

namespace Clarity.Domain.Features.Extensions
{
    public static class StateExtensions
    {
        public static StateDto ToDto(this State state)
            => new StateDto
            {
                Name = state.Name,
                StateId = state.StateId,
                Order = state.Order
            };
    }
}
