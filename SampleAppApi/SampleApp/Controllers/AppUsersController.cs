using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Expenses.DataAccess.Dtos.Security;
using SampleApp.DataAccess.Dtos.Security;
using SampleApp.DataAccess.Models.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SampleApp.Security;
using SampleApp.Services;

namespace SampleApp.Controllers
{
    [Authorize(Roles = nameof(AppUserRole.Admin))]
    [ApiController]
    [Route("api/[controller]")]
    public class AppUsersController : ControllerBase
    {
        private readonly AppUserService _userService;
        private readonly TokenManager _tokenManager;
        private readonly IMapper _mapper;

        public AppUsersController(AppUserService userService, TokenManager tokenManager, IMapper mapper)
        {
            _userService = userService;
            _tokenManager = tokenManager;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<ActionResult<AppUserDto>> Authenticate([FromBody]AppLoginDto appLoginDto)
        {
            var user = await _userService.Authenticate(appLoginDto.Username, appLoginDto.Password);

            if (user == null)
                return BadRequest(new ApiErrorDto { Message = "Username or password is incorrect" });

            if(!user.IsRegistrationAccepted())
                return BadRequest(new ApiErrorDto { Message = "User is not yet accepted. Please contact the admin." });

            var respUserDto = _mapper.Map<AppUserDto>(user);
            respUserDto.Token = _tokenManager.GenerateToken(user);

            return respUserDto;
        }

        [Authorize(Roles = RoleContants.AllRolesExceptNone)]
        [HttpGet("userfromtoken")]
        public async Task<ActionResult<AppUserDto>> GetUserFromToken()
        {
            var username = User.Identity.Name;
            var user = await _userService.GetByUsername(username);

            if (user == null)
                return BadRequest(new ApiErrorDto { Message = "Unable to find the user." });

            if (!user.IsRegistrationAccepted())
                return BadRequest(new ApiErrorDto { Message = "User is not yet accepted. Please contact the admin." });

            var respUserDto = _mapper.Map<AppUserDto>(user);

            return respUserDto;
        }

        // /api/appusers/register/
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]AppUserDto appUserDto)
        {
            var user = _mapper.Map<AppUser>(appUserDto);

            try
            {
                _userService.Create(user, appUserDto.Password);
                return Ok();
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return BadRequest(new ApiErrorDto { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IList<AppUserDto>>> GetAll()
        {
            var users = await _userService.GetAll();
            var userDtos = _mapper.Map<IList<AppUserDto>>(users);
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<AppUserDto> GetById(int id)
        {
            var user = _userService.GetById(id);
            var userDto = _mapper.Map<AppUserDto>(user);
            return userDto;
        }

        [HttpPost("accept/{id}")]
        public async Task<ActionResult<AppUserDto>> AcceptRegistration(int id)
        {
            var user = await _userService.AcceptRegistration(id);
            var userDto = _mapper.Map<AppUserDto>(user);
            return userDto;
        }
    }
}