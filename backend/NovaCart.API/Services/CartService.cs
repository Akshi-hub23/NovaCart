using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class CartService
{
    private readonly NovaCartDbContext _context;

    public CartService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<CartResponseDto> GetCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(cart => cart.CartItems)
            .ThenInclude(cartItem => cartItem.Product)
            .FirstOrDefaultAsync(cart => cart.UserId == userId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = userId
            };

            _context.Carts.Add(cart);

            await _context.SaveChangesAsync();
        }

        var items = cart.CartItems.Select(cartItem => new CartItemResponseDto
        {
            Id = cartItem.Id,
            ProductId = cartItem.ProductId,
            ProductName = cartItem.Product.Name,
            Price = cartItem.Product.Price,
            Quantity = cartItem.Quantity,
            Subtotal = cartItem.Product.Price * cartItem.Quantity
        }).ToList();

        return new CartResponseDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = items,
            Total = items.Sum(item => item.Subtotal),
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }

    public async Task<bool> ValidateProductForCartAsync(
    CartItemCreateDto dto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(product => product.Id == dto.ProductId);

        if (product is null)
        {
            return false;
        }

        if (!product.IsActive)
        {
            return false;
        }

        if (product.StockQuantity < dto.Quantity)
        {
            return false;
        }

        return true;
    }

    public async Task<bool> AddItemAsync(
    int userId,
    CartItemCreateDto dto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(product => product.Id == dto.ProductId);

        if (product is null || !product.IsActive)
        {
            return false;
        }

        var cart = await _context.Carts
            .FirstOrDefaultAsync(cart => cart.UserId == userId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = userId
            };

            _context.Carts.Add(cart);

            await _context.SaveChangesAsync();
        }

        var existingCartItem = await _context.CartItems
            .FirstOrDefaultAsync(cartItem =>
                cartItem.CartId == cart.Id &&
                cartItem.ProductId == dto.ProductId);

        var currentQuantity = existingCartItem?.Quantity ?? 0;

        var newQuantity = currentQuantity + dto.Quantity;

        if (newQuantity > product.StockQuantity)
        {
            return false;
        }

        if (existingCartItem is not null)
        {
            existingCartItem.Quantity = newQuantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };

            _context.CartItems.Add(cartItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateItemAsync(
    int userId,
    int cartItemId,
    CartItemUpdateDto dto)
    {
        var cartItem = await _context.CartItems
            .Include(cartItem => cartItem.Cart)
            .Include(cartItem => cartItem.Product)
            .FirstOrDefaultAsync(cartItem =>
                cartItem.Id == cartItemId &&
                cartItem.Cart.UserId == userId);

        if (cartItem is null)
        {
            return false;
        }

        if (!cartItem.Product.IsActive)
        {
            return false;
        }

        if (dto.Quantity > cartItem.Product.StockQuantity)
        {
            return false;
        }

        cartItem.Quantity = dto.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveItemAsync(
    int userId,
    int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(cartItem => cartItem.Cart)
            .FirstOrDefaultAsync(cartItem =>
                cartItem.Id == cartItemId &&
                cartItem.Cart.UserId == userId);

        if (cartItem is null)
        {
            return false;
        }

        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        _context.CartItems.Remove(cartItem);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(cart => cart.CartItems)
            .FirstOrDefaultAsync(cart => cart.UserId == userId);

        if (cart is null)
        {
            return false;
        }

        _context.CartItems.RemoveRange(cart.CartItems);

        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}