using System;

namespace SampleApp.DataAccess.Models.Core
{
    public abstract class BaseModel : ITrackable
    {
        // ITrackable
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public string LastUpdatedBy { get; set; }
    }
}
