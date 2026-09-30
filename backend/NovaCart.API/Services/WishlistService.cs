using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class WishlistService
{
    private readonly NovaCartDbContext _context;

    public WishlistService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<WishlistResponseDto> GetWishlistAsync(int userId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        return MapToDto(wishlist);
    }

    public async Task<WishlistResponseDto?> AddToWishlistAsync(int userId, int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null || !product.IsActive) return null;

        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist { UserId = userId };
            _context.Wishlists.Add(wishlist);
        }

        if (!wishlist.WishlistItems.Any(wi => wi.ProductId == productId))
        {
            wishlist.WishlistItems.Add(new WishlistItem
            {
                ProductId = productId,
                AddedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        return MapToDto(wishlist);
    }

    public async Task<WishlistResponseDto?> RemoveFromWishlistAsync(int userId, int productId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
                .ThenInclude(wi => wi.Product)
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wishlist == null) return null;

        var itemToRemove = wishlist.WishlistItems.FirstOrDefault(wi => wi.ProductId == productId);
        if (itemToRemove != null)
        {
            _context.WishlistItems.Remove(itemToRemove);
            await _context.SaveChangesAsync();
        }

        return MapToDto(wishlist);
    }

    public async Task<bool> MoveToCartAsync(int userId, int productId)
    {
        var wishlist = await _context.Wishlists
            .Include(w => w.WishlistItems)
            .FirstOrDefaultAsync(w => w.UserId == userId);
            
        if (wishlist == null) return false;
        
        var item = wishlist.WishlistItems.FirstOrDefault(wi => wi.ProductId == productId);
        if (item == null) return false;

        // Add directly via DbContext to avoid circular service dependency
        var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var product = await _context.Products.FindAsync(productId);
        if (product == null || !product.IsActive || product.StockQuantity < 1) return false;

        var existingCartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == productId);
        if (existingCartItem != null)
        {
            if (existingCartItem.Quantity + 1 > product.StockQuantity) return false;
            existingCartItem.Quantity++;
        }
        else
        {
            _context.CartItems.Add(new CartItem { CartId = cart.Id, ProductId = productId, Quantity = 1 });
        }

        _context.WishlistItems.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    private static WishlistResponseDto MapToDto(Wishlist wishlist)
    {
        return new WishlistResponseDto
        {
            Id = wishlist.Id,
            UserId = wishlist.UserId,
            Items = wishlist.WishlistItems.Select(wi => new WishlistItemResponseDto
            {
                Id = wi.Id,
                ProductId = wi.ProductId,
                ProductName = wi.Product?.Name ?? "Unknown Product",
                UnitPrice = wi.Product?.Price ?? 0,
                ImageUrl = wi.Product?.ImageUrl ?? string.Empty,
                IsInStock = (wi.Product?.StockQuantity ?? 0) > 0,
                AddedAt = wi.AddedAt
            }).OrderByDescending(wi => wi.AddedAt).ToList()
        };
    }
}
