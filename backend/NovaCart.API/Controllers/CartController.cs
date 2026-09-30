using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaCart.API.Services;
using System.Security.Claims;
using NovaCart.API.DTOs;
namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var cart = await _cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(CartItemCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var result = await _cartService.AddItemAsync(userId, dto);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Product is unavailable or there is insufficient stock."
            });
        }

        var cart = await _cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpPut("items/{cartItemId:int}")]
    public async Task<IActionResult> UpdateItem(
    int cartItemId,
    CartItemUpdateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var result = await _cartService.UpdateItemAsync(
            userId,
            cartItemId,
            dto);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Cart item was not found, the product is unavailable, or there is insufficient stock."
            });
        }

        var cart = await _cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpDelete("items/{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var result = await _cartService.RemoveItemAsync(
            userId,
            cartItemId);

        if (!result)
        {
            return NotFound(new
            {
                message = "Cart item not found."
            });
        }

        var cart = await _cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var result = await _cartService.ClearCartAsync(userId);

        if (!result)
        {
            return NotFound(new
            {
                message = "Cart not found."
            });
        }

        return NoContent();
    }
}