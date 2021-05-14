using Clarity.Core.Models;
using Clarity.Domain.Features;

namespace Clarity.Testing.Builders
{
    public class TicketDtoBuilder
    {
        private TicketDto _ticketDto;

        public static TicketDto WithDefaults()
        {
            return new TicketDto();
        }

        public TicketDtoBuilder()
        {
            _ticketDto = WithDefaults();
        }

        public TicketDto Build()
        {
            return _ticketDto;
        }
    }
}
