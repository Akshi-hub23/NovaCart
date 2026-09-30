namespace NovaCart.API.DTOs;

public class OrderCreateDto
{
    public int AddressId { get; set; }

    public string PaymentMethod { get; set; } = "Cash on Delivery";
}
