// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.SprintAggregate.Queries;

public class GetSprintByIdRequest : IRequest<GetSprintByIdResponse>
{
    public Guid SprintId { get; set; }
}

public class GetSprintByIdResponse
{
    public SprintDto Sprint { get; set; }
}

public class GetSprintByIdRequestHandler : IRequestHandler<GetSprintByIdRequest, GetSprintByIdResponse>
{
    private readonly IClarityDbContext _context;
    public GetSprintByIdRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetSprintByIdResponse> Handle(GetSprintByIdRequest request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints
            .FirstOrDefaultAsync(x => x.SprintId == request.SprintId);

        return new()
        {
            Sprint = sprint?.ToDto()
        };
    }
}
