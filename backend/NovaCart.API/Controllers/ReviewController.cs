using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaCart.API.DTOs;
using NovaCart.API.Services;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost("{productId:int}")]
    public async Task<IActionResult> CreateReview(
        int productId,
        ReviewCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var review = await _reviewService.CreateReviewAsync(
            userId,
            productId,
            dto);

        if (review is null)
        {
            return BadRequest(new
            {
                message = "Unable to create review. Product may not exist or you may have already reviewed this product."
            });
        }

        return CreatedAtAction(
            nameof(CreateReview),
            new { productId },
            review);
    }

    [HttpGet("product/{productId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductReviews(int productId)
    {
        var reviews = await _reviewService
            .GetProductReviewsAsync(productId);

        return Ok(reviews);
    }

    [HttpGet("product/{productId:int}/rating")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductRating(int productId)
    {
        var rating = await _reviewService
            .GetProductRatingAsync(productId);

        return Ok(rating);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateReview(
    int id,
    ReviewCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var review = await _reviewService.UpdateReviewAsync(
            id,
            userId,
            dto);

        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        return Ok(review);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var deleted = await _reviewService.DeleteReviewAsync(
            id,
            userId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Review not found."
            });
        }

        return NoContent();
    }
}