// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Security;

public class TokenProvider : ITokenProvider
{
    private IConfiguration _configuration;
    public TokenProvider(IConfiguration configuration)
        => _configuration = configuration;

    public string Get(string uniqueName, IEnumerable<Claim> customClaims = null)
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

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[$"{nameof(Authentication)}:{nameof(Authentication.JwtKey)}"])),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken securityToken;
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

}

