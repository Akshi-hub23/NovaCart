using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaCart.API.Services;
using NovaCart.API.DTOs;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        OrderResponseDto? order;
        try
        {
            order = await _orderService.CreateOrderAsync(userId, dto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        if (order is null)
        {
            return BadRequest(new
            {
                message = "Unable to create order. Cart may be empty, a product may be inactive, or there may not be enough stock."
            });
        }

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            order);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderById(int id)
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

        var order = await _orderService.GetOrderByIdAsync(
            id,
            userId);

        if (order is null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
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

        var orders = await _orderService.GetMyOrdersAsync(userId);

        return Ok(orders);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrdersForAdmin()
    {
        var orders = await _orderService.GetAllOrdersAsync();

        return Ok(orders);
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(
    int id,
    OrderStatusUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Status))
        {
            return BadRequest(new
            {
                message = "Order status is required."
            });
        }

        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(
                id,
                dto.Status);

            if (order is null)
            {
                return NotFound(new
                {
                    message = "Order not found."
                });
            }

            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
