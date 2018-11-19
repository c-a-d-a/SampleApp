using AutoMapper;
using SampleApp.DataAccess.Contexts;
using SampleApp.DataAccess.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Security;
using SampleApp.Services;

namespace SampleApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddHttpContextAccessor();
            services.AddDbContext<SampleAppContext>(opt => opt.UseInMemoryDatabase("SampleAppDb"));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddTransient<AppUserService>();
            services.Configure<RootAccount>(Configuration.GetSection("RootAccount"));

            // configure strongly typed settings objects
            var jwtSettings = Configuration.GetSection("JwtSettings");
            services.Configure<JwtSettings>(jwtSettings);

            services.ConfigureJwtBearer(jwtSettings.Get<JwtSettings>());

            services.AddAutoMapper();
            services.AddTransient<TokenManager>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, SampleAppContext context)
        {
            if (env.IsDevelopment())
            {
                // this is only for seed data
                context.Database.EnsureCreated();

                app.UseDeveloperExceptionPage();

                // global cors policy
                app.UseCors(x => x
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            }

            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
