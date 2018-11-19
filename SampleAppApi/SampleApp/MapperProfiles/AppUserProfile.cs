using AutoMapper;
using SampleApp.DataAccess.Dtos.Security;
using SampleApp.DataAccess.Models.Security;

namespace SampleApp.MapperProfiles
{
    public class AppUserProfile : Profile
    {
        public AppUserProfile()
        {
            CreateMap<AppUserDto, AppUser>();
            CreateMap<AppUser, AppUserDto>();
        }
    }
}
