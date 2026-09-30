using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaCart.API.Services;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly WishlistService _wishlistService;

    public WishlistController(WishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var wishlist = await _wishlistService.GetWishlistAsync(userId.Value);
        return Ok(wishlist);
    }

    [HttpPost("{productId:int}")]
    public async Task<IActionResult> AddToWishlist(int productId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var wishlist = await _wishlistService.AddToWishlistAsync(userId.Value, productId);
        if (wishlist == null) return BadRequest(new { message = "Could not add product to wishlist." });

        return Ok(wishlist);
    }

    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var wishlist = await _wishlistService.RemoveFromWishlistAsync(userId.Value, productId);
        if (wishlist == null) return NotFound(new { message = "Wishlist not found." });

        return Ok(wishlist);
    }

    [HttpPost("{productId:int}/move-to-cart")]
    public async Task<IActionResult> MoveToCart(int productId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _wishlistService.MoveToCartAsync(userId.Value, productId);
        if (!success) return BadRequest(new { message = "Failed to move item to cart. It may be out of stock." });

        return Ok(new { message = "Item moved to cart successfully." });
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }
}
