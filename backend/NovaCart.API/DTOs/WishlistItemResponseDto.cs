namespace NovaCart.API.DTOs;

public class WishlistItemResponseDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsInStock { get; set; }
    public DateTime AddedAt { get; set; }
}
