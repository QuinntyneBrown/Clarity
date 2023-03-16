// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TicketAggregate.Commands;

public class CreateTicketRequestValidator: AbstractValidator<CreateTicketRequest>
{
    public CreateTicketRequestValidator(){

        RuleFor(x => x.Name).NotNull();

    }

}


public class CreateTicketRequest: IRequest<CreateTicketResponse>
{
    public string Name { get; set; }
}


public class CreateTicketResponse
{
    public required TicketDto Ticket { get; set; }
}


public class CreateTicketRequestHandler: IRequestHandler<CreateTicketRequest,CreateTicketResponse>
{
    private readonly IClarityDbContext _context;

    private readonly ILogger<CreateTicketRequestHandler> _logger;

    public CreateTicketRequestHandler(ILogger<CreateTicketRequestHandler> logger,IClarityDbContext context){
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<CreateTicketResponse> Handle(CreateTicketRequest request,CancellationToken cancellationToken)
    {
        var ticket = new Ticket(default,"","",default,default);

        _context.Tickets.Add(ticket);


        await _context.SaveChangesAsync(cancellationToken);

        return new ()
        {
            Ticket = ticket.ToDto()
        };

    }

}



