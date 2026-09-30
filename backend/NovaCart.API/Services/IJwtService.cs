using NovaCart.API.Models;

namespace NovaCart.API.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}