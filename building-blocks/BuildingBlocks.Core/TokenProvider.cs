using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BuildingBlocks.Core
{
    public interface ITokenProvider
    {
        string Get(string username, List<Claim> customClaims = null);
    }

    public class TokenProvider : ITokenProvider
    {
        private IConfiguration _configuration;
        public TokenProvider(IConfiguration configuration)
            => _configuration = configuration;

        public string Get(string uniqueName, List<Claim> customClaims = null)
        {
            var now = DateTime.UtcNow;
            var nowDateTimeOffset = new DateTimeOffset(now);

            var claims = new List<Claim>()
                {
                    new Claim(JwtRegisteredClaimNames.UniqueName, uniqueName),
                    new Claim(JwtRegisteredClaimNames.Sub, uniqueName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, nowDateTimeOffset.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                };

            if (customClaims != null)
                claims.AddRange(customClaims);

            var jwt = new JwtSecurityToken(
                issuer: _configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtIssuer)}"],
                audience: _configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtAudience)}"],
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(Convert.ToInt16(_configuration[$"{nameof(Authentication)}:{nameof(Authentication.ExpirationMinutes)}"])),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtKey)}"])), SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
