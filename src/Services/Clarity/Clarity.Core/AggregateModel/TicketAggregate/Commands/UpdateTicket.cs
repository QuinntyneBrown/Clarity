// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
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
}


public class UpdateTicketResponse
{
    public required TicketDto Ticket { get; set; }
}


public class UpdateTicketRequestHandler: IRequestHandler<UpdateTicketRequest,UpdateTicketResponse>
{
    private readonly IClarityDbContext _context;

    private readonly ILogger<UpdateTicketRequestHandler> _logger;

    public UpdateTicketRequestHandler(ILogger<UpdateTicketRequestHandler> logger,IClarityDbContext context){
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UpdateTicketResponse> Handle(UpdateTicketRequest request,CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets.SingleAsync(x => x.TicketId == request.TicketId);


        await _context.SaveChangesAsync(cancellationToken);

        return new ()
        {
            Ticket = ticket.ToDto()
        };

    }

}



