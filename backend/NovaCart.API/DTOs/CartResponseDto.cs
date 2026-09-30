namespace NovaCart.API.DTOs;

public class CartResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public List<CartItemResponseDto> Items { get; set; } = new();

    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}