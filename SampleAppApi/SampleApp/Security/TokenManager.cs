using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SampleApp.DataAccess.Models.Security;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace SampleApp.Security
{
    public class TokenManager
    {
        private readonly JwtSettings _jwtSettings;

        public TokenManager(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        public string GenerateToken(AppUser appUser)
        {
            Claim[] claims =
            {
                new Claim(ClaimTypes.NameIdentifier, appUser.AppUserId.ToString()),
                new Claim(ClaimTypes.Name, appUser.Username),
                new Claim(ClaimTypes.Role, appUser.GetRole()),
            };

            SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(
                    CreateSymmetricSecurityKey(_jwtSettings.Secret),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.CreateJwtSecurityToken(descriptor);
            return handler.WriteToken(token);
        }

        public static SymmetricSecurityKey CreateSymmetricSecurityKey(string secretKey)
        {
            var key = Encoding.ASCII.GetBytes(secretKey);
            return new SymmetricSecurityKey(key);
        }
    }
}