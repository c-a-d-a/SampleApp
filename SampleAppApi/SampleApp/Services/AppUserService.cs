using System;
using System.Linq;
using System.Threading.Tasks;
using SampleApp.DataAccess.Contexts;
using SampleApp.DataAccess.Helpers;
using SampleApp.DataAccess.Models.Security;
using Microsoft.EntityFrameworkCore;
using SampleApp.Security;

namespace SampleApp.Services
{
    public class AppUserService
    {
        private readonly SampleAppContext _context;

        public AppUserService(SampleAppContext context)
        {
            _context = context;
        }

        public async Task<AppUser> GetById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetByUsername(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        }

        public async Task<AppUser> Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == username);

            if (user == null ||
                !SecurityUtils.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        public async Task<AppUser[]> GetAll()
        {
            return await _context.Users.ToArrayAsync();
        }

        public AppUser Create(AppUser user, string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new Exception("Password is required");

            if (_context.Users.Any(x => x.Username == user.Username))
                throw new Exception("Username \"" + user.Username + "\" is already taken");

            SecurityUtils.CreatePasswordHash(password, out var passwordHash, out var passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.AppUserRole = AppUserRole.None;

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public async Task Update(AppUser userParam, string password = null)
        {
            var user = await _context.Users.FindAsync(userParam.AppUserId);

            if (user == null)
                throw new Exception("User not found");

            if (userParam.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                if (await _context.Users.AnyAsync(x => x.Username == userParam.Username))
                    throw new Exception("Username " + userParam.Username + " is already taken");
            }

            // update user properties
            user.FirstName = userParam.FirstName;
            user.LastName = userParam.LastName;
            user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                SecurityUtils.CreatePasswordHash(password, out var passwordHash, out var passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<AppUser> AcceptRegistration(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(!user.IsRegistrationAccepted())
            {
                user.AppUserRole = AppUserRole.Normal;
                await _context.SaveChangesAsync();
            }

            return user;
        }
    }
}
