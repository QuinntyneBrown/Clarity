using Kernel;
using Clarity.Core.AggregateModel.Identity;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.UserAggregate.Queries;

 public class GetCurrentUser
 {
     public class Request : IRequest<Response>
     { }
     public class Response : ResponseBase
     {
         public UserDto User { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly IClarityDbContext _context;
         private readonly IHttpContextAccessor _httpContextAccessor;
         public Handler(IClarityDbContext context, IHttpContextAccessor httpContextAccessor)
         {
             _context = context;
             _httpContextAccessor = httpContextAccessor;
         }
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
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
 }
