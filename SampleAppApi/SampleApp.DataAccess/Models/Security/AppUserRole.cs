namespace SampleApp.DataAccess.Models.Security
{
    public static class RoleContants
    {
        public const string AllRolesExceptNone = nameof(AppUserRole.Normal) + "," + nameof(AppUserRole.Admin);
    }
    public enum AppUserRole
    {
        None = 0,
        Normal = 1,
        Admin = 2
    }
}
