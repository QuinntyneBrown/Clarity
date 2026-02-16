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

public class CreateTicketRequestValidator: AbstractValidator<CreateTicketRequest>
{
    public CreateTicketRequestValidator(){

        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleFor(x => x.Description).NotNull().NotEmpty();
        RuleFor(x => x.AcceptanceCriteria).NotNull().NotEmpty();
        RuleFor(x => x.State).NotNull();
    }
}

public class CreateTicketRequest: IRequest<CreateTicketResponse>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string AcceptanceCriteria { get; set; }
    public StateType State { get; set; }
}


public class CreateTicketResponse
{
    public required TicketDto Ticket { get; set; }
}

public class CreateTicketRequestHandler: IRequestHandler<CreateTicketRequest,CreateTicketResponse>
{
    private readonly IClarityDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<CreateTicketRequestHandler> _logger;

    public CreateTicketRequestHandler(
        ILogger<CreateTicketRequestHandler> logger,
        IHttpContextAccessor httpContextAccessor,
        IClarityDbContext context){
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<CreateTicketResponse> Handle(CreateTicketRequest request,CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext.User.Identity.Name;

        var currentTeamMemberId = (await _context.TeamMembers.SingleAsync(x => x.Name == username)).TeamMemberId;

        var ticket = new Ticket(
            currentTeamMemberId,
            request.Name,
            default,
            (Html)request.AcceptanceCriteria,
            (Html)request.Description);

        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync(cancellationToken);

        return new ()
        {
            Ticket = ticket.ToDto()
        };
    }
}