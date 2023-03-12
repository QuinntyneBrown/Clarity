using Kernel;
using Clarity.Core.AggregateModel.Identity;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.UserAggregate.Queries;

 public class GetCurrentUserRequest : IRequest<GetCurrentUserResponse> { }

 public class GetCurrentUserResponse : ResponseBase
 {
     public UserDto User { get; set; }
 }
 public class GetCurrentUserRequestHandler : IRequestHandler<GetCurrentUserRequest, GetCurrentUserResponse>
 {
     private readonly IClarityDbContext _context;
     private readonly IHttpContextAccessor _httpContextAccessor;
     public GetCurrentUserRequestHandler(IClarityDbContext context, IHttpContextAccessor httpContextAccessor)
     {
         _context = context;
         _httpContextAccessor = httpContextAccessor;
     }
     public async Task<GetCurrentUserResponse> Handle(GetCurrentUserRequest request, CancellationToken cancellationToken)
     {
         var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
         var user = await _context.Users.SingleAsync(x => x.UserId == userId);
         if (user == null)
             throw new Exception();
         return new()
         {
             User = new UserDto
             {
                 Username = user.Username,
                 UserId = user.UserId
             }
         };
     }
 }

