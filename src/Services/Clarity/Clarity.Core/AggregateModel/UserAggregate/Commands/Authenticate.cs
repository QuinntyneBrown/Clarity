using Clarity.Core.AggregateModel.UserAggregate;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Security;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.UserAggregate.Commands;

public class Authenticate
{
    public class Request : IRequest<Response>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class Response : ResponseBase
    {
        public string AccessToken { get; set; }
        public Guid UserId { get; set; }
    }

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly IClarityDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenProvider _tokenProvider;

        public Handler(IClarityDbContext context, ITokenProvider tokenProvider, IPasswordHasher passwordHasher)
        {
            _context = context;
            _tokenProvider = tokenProvider;
            _passwordHasher = passwordHasher;
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.Username.ToLower() == request.Username.ToLower());

            if (user == null)
                throw new Exception();

            if (!ValidateUser(user, _passwordHasher.HashPassword(user.Salt, request.Password)))
                throw new Exception();

            return new()
            {
                AccessToken = _tokenProvider.Get(request.Username, new List<Claim>() { }),
                UserId = user.UserId
            };
        }

        public bool ValidateUser(User user, string transformedPassword)
        {
            if (user == null || transformedPassword == null)
                return false;

            return user.Password == transformedPassword;
        }
    }
}
