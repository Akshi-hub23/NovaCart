namespace NovaCart.API.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? AddressId { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "Pending";

    public string PaymentMethod { get; set; } = "Cash on Delivery";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public Address? Address { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
        = new List<OrderItem>();
}
