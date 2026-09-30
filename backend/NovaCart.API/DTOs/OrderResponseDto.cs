namespace NovaCart.API.DTOs;

public class OrderResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = string.Empty;

    public AddressResponseDto? Address { get; set; }

    public List<OrderItemResponseDto> Items { get; set; }
        = new List<OrderItemResponseDto>();

    public DateTime CreatedAt { get; set; }
}
