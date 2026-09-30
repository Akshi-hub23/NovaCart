using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class ReviewCreateDto
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(1000)]
    public string Comment { get; set; } = string.Empty;
}