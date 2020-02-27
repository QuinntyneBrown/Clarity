namespace Clarity.Core.Identity
{
    public class Authentication
    {
        public string TokenPath { get; set; }
        public int ExpirationMinutes { get; set; }
        public string JwtKey { get; set; }
        public string JwtIssuer { get; set; }
        public string JwtAudience { get; set; }
        public string AuthType { get; set; }
    }
}
