using SampleApp.DataAccess.Helpers;
using SampleApp.DataAccess.Models.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace SampleApp.Security
{
    public static class SecurityExtensions
    {
        public static IServiceCollection ConfigureJwtBearer(this IServiceCollection services, JwtSettings settings)
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = TokenManager.CreateSymmetricSecurityKey(settings.Secret),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });


            return services;
        }

        //public static IServiceCollection ConfigureRoleAuthorization(this IServiceCollection services)
        //{
        //    services.AddAuthorization(options =>
        //    {
        //        options.AddPolicy("RequireAdminRole", policy =>
        //            policy.Requirements.Add(new RoleRequirement(AppUserRole.Admin)));
        //    });

        //    return services;
        //}

        public static string GetRole(this AppUser appUser)
        {
            return appUser.AppUserRole.GetName();
        }

        public static bool IsRegistrationAccepted(this AppUser appUser)
        {
            return appUser.AppUserRole != AppUserRole.None;
        }
    }
}