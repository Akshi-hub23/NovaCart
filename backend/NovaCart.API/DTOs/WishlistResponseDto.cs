namespace NovaCart.API.DTOs;

public class WishlistResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<WishlistItemResponseDto> Items { get; set; } = new();
}
