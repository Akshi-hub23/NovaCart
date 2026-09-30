using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class UserProfileUpdateDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
}
