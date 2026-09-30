using Microsoft.AspNetCore.Mvc;
using NovaCart.API.DTOs;
using NovaCart.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(UserCreateDto dto)
    {
        var user = await _userService.CreateUserAsync(dto);

        if (user is null)
        {
            return Conflict(new
            {
                message = "A user with this email already exists."
            });
        }

        return CreatedAtAction(
            nameof(CreateUser),
            new { id = user.Id },
            user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        var user = await _userService.LoginUserAsync(dto);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(user);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(idClaim, out var userId)) return Unauthorized();
        var user = await _userService.GetUserByIdAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UserProfileUpdateDto dto)
    {
        dto.Name = dto.Name.Trim();
        if (dto.Name.Length < 2) return BadRequest(new { message = "Name must be at least 2 characters." });
        var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(idClaim, out var userId)) return Unauthorized();
        var user = await _userService.UpdateNameAsync(userId, dto.Name);
        return user is null ? NotFound() : Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-test")]
    public IActionResult AdminTest()
    {
        return Ok(new
        {
            message = "You are authorized as an Admin."
        });
    }

    
}
