using Clarity.Domain.Features.States;
using Clarity.Core.Models;

namespace Clarity.Domain.Features.Extensions
{
    public static class StateExtensions
    {
        public static StateDto ToDto(this State state)
        {
            return new StateDto
            {
                Name = state.Name,
                StateId = state.StateId,
                Order = state.Order
            };
        }
    }
}
