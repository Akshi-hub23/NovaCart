namespace NovaCart.API.Models;

public class Product
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public string? Brand { get; set; }

    public string AttributesJson { get; set; } = "{}";

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> OrderItems { get; set; }
    = new List<OrderItem>();
}
