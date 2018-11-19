using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SampleApp.DataAccess.Helpers;
using SampleApp.DataAccess.Models.Core;
using SampleApp.DataAccess.Models.Security;

namespace SampleApp.DataAccess.Contexts
{
    public class SampleAppContext : DbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly RootAccount _rootAccount;
        public SampleAppContext(DbContextOptions<SampleAppContext> options, IOptions<RootAccount> rootAccount, IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            _rootAccount = rootAccount.Value;
        }

        public DbSet<AppUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SecurityUtils.CreatePasswordHash(_rootAccount.Password, out var passwordHash, out var passwordSalt);
            var now = DateTime.Now;

            modelBuilder.Entity<AppUser>().HasData(new AppUser()
            {
                AppUserId = 9999,
                FirstName = "",
                Email = "a@b.com",
                LastName = "",
                Username = _rootAccount.Username,
                AppUserRole = AppUserRole.Admin,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                CreatedAt = now,
                CreatedBy = "system",
                LastUpdatedAt = now,
                LastUpdatedBy = "system"
            });
        }

        public override int SaveChanges()
        {
            ProcessTracking();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            ProcessTracking();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            ProcessTracking();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void ProcessTracking()
        {
            var entries = ChangeTracker.Entries();
            foreach (var entry in entries)
            {
                if (entry.Entity is ITrackable trackable)
                {
                    var now = DateTime.Now;
                    var user = GetCurrentUser();
                    switch (entry.State)
                    {
                        case EntityState.Modified:
                            trackable.LastUpdatedAt = now;
                            trackable.LastUpdatedBy = user;
                            break;

                        case EntityState.Added:
                            trackable.CreatedAt = now;
                            trackable.CreatedBy = user;
                            trackable.LastUpdatedAt = now;
                            trackable.LastUpdatedBy = user;
                            break;
                    }
                }
            }
        }

        private string GetCurrentUser()
        {
            return _httpContextAccessor.HttpContext.User.Identity.Name ?? "anonymous";
        }
    }
}
