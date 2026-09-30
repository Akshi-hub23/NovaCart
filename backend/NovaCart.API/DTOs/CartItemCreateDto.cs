using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class CartItemCreateDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; }
}