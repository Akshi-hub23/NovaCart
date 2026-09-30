using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class UserService
{
    private readonly NovaCartDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;

    public UserService(
        NovaCartDbContext context,
        PasswordHasher<User> passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<UserResponseDto?> CreateUserAsync(UserCreateDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var emailExists = await _context.Users
            .AnyAsync(user => user.Email == email);

        if (emailExists)
        {
            return null;
        }

        var user = new User
        {
            Name = dto.Name,
            Email = email,
            Role = "Customer",
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password);

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == userId);
        return user is null ? null : ToResponse(user);
    }

    public async Task<UserResponseDto?> UpdateNameAsync(int userId, string name)
    {
        var user = await _context.Users.FirstOrDefaultAsync(item => item.Id == userId);
        if (user is null) return null;
        user.Name = name.Trim();
        await _context.SaveChangesAsync();
        return ToResponse(user);
    }

    private static UserResponseDto ToResponse(User user) => new()
    {
        Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role, CreatedAt = user.CreatedAt
    };

    public async Task<LoginResponseDto?> LoginUserAsync(UserLoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Email == email);

        if (user is null)
        {
            return null;
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            User = new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }
        };
    }

   
}
