using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace BuildingBlocks.AspNetCore
{
    public interface ICurrentUserService
    {
        ClaimsPrincipal Get();
    }
    public class CurrentUserService: ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public ClaimsPrincipal Get()
        {
            return _httpContextAccessor.HttpContext.User;
        }
    }
}
