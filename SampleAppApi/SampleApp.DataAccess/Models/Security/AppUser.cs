using System;
using SampleApp.DataAccess.Models.Core;

namespace SampleApp.DataAccess.Models.Security
{
    public class AppUser : BaseModel
    {
        public int AppUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public AppUserRole AppUserRole { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
