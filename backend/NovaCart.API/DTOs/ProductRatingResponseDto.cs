namespace NovaCart.API.DTOs;

public class ProductRatingResponseDto
{
    public int ProductId { get; set; }

    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }
}