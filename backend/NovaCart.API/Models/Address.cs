namespace NovaCart.API.Models;

public class Address
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string AddressLine { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}