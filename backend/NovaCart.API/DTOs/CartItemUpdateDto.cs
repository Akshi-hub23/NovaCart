using System.ComponentModel.DataAnnotations;

namespace NovaCart.API.DTOs;

public class CartItemUpdateDto
{
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}