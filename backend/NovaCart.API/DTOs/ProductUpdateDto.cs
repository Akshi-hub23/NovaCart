using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class ProductUpdateDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, 1000000)]
    public decimal Price { get; set; }

    [Range(0, 1000000)]
    public int StockQuantity { get; set; }

    [StringLength(500)]
    [Url(ErrorMessage = "ImageUrl must be a valid URL.")]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; }
    [Required]
    public int CategoryId { get; set; }

    [StringLength(100)]
    public string? Brand { get; set; }

    public Dictionary<string, string> Attributes { get; set; } = new();
}
