// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.ValueObjects;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

public class UpdateTicketRequestValidator: AbstractValidator<UpdateTicketRequest>
{
    public UpdateTicketRequestValidator(){

        RuleFor(x => x.TicketId).NotEqual(default(Guid));
        RuleFor(x => x.Name).NotNull();
    }

}

public class UpdateTicketRequest: IRequest<UpdateTicketResponse>
{
    public Guid TicketId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string AcceptanceCriteria { get; set; }
    public string Url { get; set; }
    public StateType State { get; set; }
    public Guid? InitiativeId { get; set; }
    public Guid? TeamMemberId { get; set; }
    public int Priority { get; set; }
    public int StoryPoints { get; set; }
    public int Effort { get; set; }
    public TicketType TicketType { get; set; }
}

public class UpdateTicketResponse
{
    public required TicketDto Ticket { get; set; }
}

public class UpdateTicketRequestHandler: IRequestHandler<UpdateTicketRequest,UpdateTicketResponse>
{
    private readonly IClarityDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<CreateTicketRequestHandler> _logger;

    public UpdateTicketRequestHandler(
        ILogger<CreateTicketRequestHandler> logger,
        IHttpContextAccessor httpContextAccessor,
        IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateTicketResponse> Handle(UpdateTicketRequest request,CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.BoardState)
            .Include(x => x.TeamMember)
            .Include(x => x.Initiative)
            .Include(x => x.Comments)
            .ThenInclude(x => x.TeamMember)
            .Include(x => x.DigitalAssets)
            .SingleAsync(x => x.TicketId == request.TicketId);

        var state = await _context.BoardStates.FindAsync(ticket.CurrentTicketState.BoardState.BoardStateId);

        Guid teamMemberId;

        if (request.TeamMemberId.HasValue)
        {
            teamMemberId = request.TeamMemberId.Value;
        }
        else
        {
            var username = _httpContextAccessor.HttpContext.User.Identity.Name;
            teamMemberId = (await _context.TeamMembers.SingleAsync(x => x.Name == username)).TeamMemberId;
        }

        ticket.Update(
            teamMemberId,
            request.Name,
            request.Url,
            (Html)request.AcceptanceCriteria,
            (Html)request.Description,
            request.Priority,
            request.StoryPoints,
            request.TicketType);

        ticket.SetInitiative(request.InitiativeId);

        ticket.UpdateEffort(request.Effort);

        ticket.TicketStates.Clear();

        ticket.TicketStates.Add(new(state));

        await _context.SaveChangesAsync(cancellationToken);

        return new ()
        {
            Ticket = ticket.ToDto()
        };

    }

}



