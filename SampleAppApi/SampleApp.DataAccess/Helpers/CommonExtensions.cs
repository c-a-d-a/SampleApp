using System;
using System.Collections.Generic;
using System.Text;
using SampleApp.DataAccess.Models.Security;

namespace SampleApp.DataAccess.Helpers
{
    public static class CommonExtensions
    {
        /// <summary>
        /// This is for runtime usage only, be sure to use nameof operator for compile time
        /// </summary>
        /// <param name="appUserRole"></param>
        /// <returns></returns>
        public static string GetName(this AppUserRole appUserRole)
        {
            return appUserRole.ToString();
        }
    }
}
