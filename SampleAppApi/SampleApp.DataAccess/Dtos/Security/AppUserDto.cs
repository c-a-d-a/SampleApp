using System;
using SampleApp.DataAccess.Models.Core;
using SampleApp.DataAccess.Models.Security;

namespace SampleApp.DataAccess.Dtos.Security
{
    public class AppUserDto : ITrackable
    {
        public int AppUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public AppUserRole AppUserRole { get; set; }

        // ITrackable
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public string LastUpdatedBy { get; set; }
    }
}
