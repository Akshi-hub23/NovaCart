using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class CategoryCreateDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    public int? ParentCategoryId { get; set; }
}
