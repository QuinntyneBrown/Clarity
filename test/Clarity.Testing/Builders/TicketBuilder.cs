using Clarity.Core.Models;

namespace Clarity.Testing.Builders
{
    public class TicketBuilder
    {
        private Ticket _ticket;

        public static Ticket WithDefaults()
        {
            return new Ticket(default, default, default, default, default);
        }

        public TicketBuilder()
        {
            _ticket = WithDefaults();
        }

        public Ticket Build()
        {
            return _ticket;
        }
    }
}
