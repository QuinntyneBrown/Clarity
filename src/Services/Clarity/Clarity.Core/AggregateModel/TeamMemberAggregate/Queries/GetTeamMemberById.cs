// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;

public class GetTeamMemberById
{
    public class GetTeamMemberByIdRequest : IRequest<GetTeamMemberByIdResponse>
    {
        public Guid TeamMemberId { get; set; }
    }
    public class GetTeamMemberByIdResponse
    {
        public TeamMemberDto TeamMember { get; set; }
    }
    public class GetTeamMemberByIdHandler : IRequestHandler<GetTeamMemberByIdRequest, GetTeamMemberByIdResponse>
    {
        private readonly IClarityDbContext _context;
        public GetTeamMemberByIdHandler(IClarityDbContext context) => _context = context;
        public async Task<GetTeamMemberByIdResponse> Handle(GetTeamMemberByIdRequest request, CancellationToken cancellationToken)
        {
            return new()
            {
                TeamMember = (await _context.TeamMembers.FirstOrDefaultAsync(x => x.TeamMemberId == request.TeamMemberId)).ToDto()
            };
        }
    }
}

