﻿using Kernel;
using Clarity.Core.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands
{
    public class UpsertTicket
    {
        public class Request : IRequest<Response>
        {
            public TicketDto Ticket { get; set; }
        }

        public class Response : ResponseBase { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityDbContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;
            public Handler(IClarityDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _httpContextAccessor = httpContextAccessor;
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var state = await _context.BoardStates.FindAsync(request.Ticket.BoardStateId);
                var username = _httpContextAccessor.HttpContext.User.Identity.Name;
                var currentTeamMemberId = (await _context.TeamMembers.SingleAsync(x => x.Name == username)).TeamMemberId;

                var ticket = await _context.Tickets
                    .Include(x => x.TicketStates)
                    .ThenInclude(x => x.BoardState)
                    .FirstOrDefaultAsync(x => x.TicketId == request.Ticket.TicketId);

                if (ticket == null)
                {
                    ticket = new(currentTeamMemberId, request.Ticket.Name, request.Ticket.Url, (Html)request.Ticket.AcceptanceCriteria, (Html)request.Ticket.Description);
                    _context.Tickets.Add(ticket);
                }
                else
                {
                    ticket.Update(currentTeamMemberId, request.Ticket.Name, request.Ticket.Url, (Html)request.Ticket.AcceptanceCriteria, (Html)request.Ticket.Description);
                }

                ticket.TicketStates.Clear();

                ticket.TicketStates.Add(new(state));

                await _context.SaveChangesAsync(cancellationToken);

                return new();
            }
        }
    }
}