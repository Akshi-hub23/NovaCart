namespace NovaCart.API.DTOs;

public class ProductResponseDto
{
    public int Id { get; set; }
    public int? CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;


    public string Name { get; set; } = string.Empty;

    public string? Brand { get; set; }

    public Dictionary<string, string> Attributes { get; set; } = new();

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
