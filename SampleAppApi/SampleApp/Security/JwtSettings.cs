namespace SampleApp.Security
{
    public class JwtSettings
    {
        public string Secret { get; set; }
        public int MinutesToExpiration { get; set; }
    }
}
