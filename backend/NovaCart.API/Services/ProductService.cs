using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;
using System.Text.Json;

namespace NovaCart.API.Services;

public class ProductService
{
    private readonly NovaCartDbContext _context;

    public ProductService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponseDto>> GetProductsAsync(string? category = null, string? subcategory = null, string? brand = null, decimal? minPrice = null, decimal? maxPrice = null, int? rating = null, bool? available = null, string? attributeKey = null, string? attributeValue = null)
    {
        var query = _context.Products.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(category))
        {
            var categories = await _context.Categories.AsNoTracking().ToListAsync();
            var selected = ResolveCategory(categories, category);
            if (selected is null) return new List<ProductResponseDto>();
            var selectedIds = DescendantIds(categories, selected.Id);
            var childFilter = subcategory;
            if (!string.IsNullOrWhiteSpace(childFilter))
            {
                var child = categories.FirstOrDefault(item => selectedIds.Contains(item.Id) && Normalize(item.Name) == Normalize(childFilter));
                if (child is null) return new List<ProductResponseDto>();
                selectedIds = DescendantIds(categories, child.Id);
            }
            query = query.Where(product => product.CategoryId.HasValue && selectedIds.Contains(product.CategoryId.Value));
        }
        if (!string.IsNullOrWhiteSpace(brand)) query = query.Where(product => product.Brand != null && EF.Functions.ILike(product.Brand, brand.Trim()));
        if (minPrice.HasValue) query = query.Where(product => product.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(product => product.Price <= maxPrice.Value);
        if (available == true) query = query.Where(product => product.StockQuantity > 0);
        if (available == false) query = query.Where(product => product.StockQuantity <= 0);
        if (rating is >= 1 and <= 5)
        {
            var ratedProducts = _context.Reviews.GroupBy(review => review.ProductId)
                .Select(group => new { ProductId = group.Key, Average = group.Average(review => review.Rating) });
            query = query.Where(product => ratedProducts.Any(item => item.ProductId == product.Id && item.Average >= rating.Value));
        }
        var products = await query.Include(product => product.Category).ToListAsync();
        var results = products.Select(ToResponse).ToList();
        if (!string.IsNullOrWhiteSpace(attributeKey) && !string.IsNullOrWhiteSpace(attributeValue))
            results = results.Where(product => product.Attributes.TryGetValue(attributeKey, out var value)
                && string.Equals(value, attributeValue, StringComparison.OrdinalIgnoreCase)).ToList();
        return results;
    }

    private static Category? ResolveCategory(List<Category> categories, string value) =>
        int.TryParse(value, out var id)
            ? categories.FirstOrDefault(item => item.Id == id)
            : categories.FirstOrDefault(item => Normalize(item.Name) == Normalize(value));

    private static HashSet<int> DescendantIds(List<Category> categories, int id)
    {
        var result = new HashSet<int> { id };
        var pending = new Queue<int>(); pending.Enqueue(id);
        while (pending.TryDequeue(out var parentId))
            foreach (var child in categories.Where(item => item.ParentCategoryId == parentId))
                if (result.Add(child.Id)) pending.Enqueue(child.Id);
        return result;
    }

    private static string Normalize(string value) => value.Trim().Replace("-", " ").ToLowerInvariant();

    public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(item => item.Category)
            .Where(product => product.Id == id)
            .FirstOrDefaultAsync();
        return product is null ? null : ToResponse(product);
    }

    public async Task<ProductResponseDto?> CreateProductAsync(ProductCreateDto dto)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(category => category.Id == dto.CategoryId);

        if (!categoryExists)
        {
            return null;
        }
        var product = new Product
        {
            Name = dto.Name,
            Brand = string.IsNullOrWhiteSpace(dto.Brand) ? null : dto.Brand.Trim(),
            AttributesJson = JsonSerializer.Serialize(dto.Attributes),
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };
        product.Category = (await _context.Categories.FindAsync(dto.CategoryId))!;

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return ToResponse(product);
    }

    public async Task<ProductResponseDto?> UpdateProductAsync(
    int id,
    ProductUpdateDto dto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return null;
        }

        var categoryExists = await _context.Categories
            .AnyAsync(category => category.Id == dto.CategoryId);

        if (!categoryExists)
        {
            return null;
        }

        product.Name = dto.Name;
        product.Brand = string.IsNullOrWhiteSpace(dto.Brand) ? null : dto.Brand.Trim();
        product.AttributesJson = JsonSerializer.Serialize(dto.Attributes);
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl;
        product.IsActive = dto.IsActive;
        product.CategoryId = dto.CategoryId;
        product.Category = (await _context.Categories.FindAsync(dto.CategoryId))!;

        await _context.SaveChangesAsync();

        return ToResponse(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(product => product.Id == id);

        if (product is null)
        {
            return false;
        }

        var hasReferences = await _context.CartItems.AnyAsync(item => item.ProductId == id)
            || await _context.OrderItems.AnyAsync(item => item.ProductId == id)
            || await _context.Reviews.AnyAsync(review => review.ProductId == id)
            || await _context.WishlistItems.AnyAsync(item => item.ProductId == id);

        if (hasReferences)
        {
            product.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return true;
    }

    private static ProductResponseDto ToResponse(Product product)
    {
        Dictionary<string, string> attributes;
        try
        {
            attributes = JsonSerializer.Deserialize<Dictionary<string, string>>(product.AttributesJson) ?? new();
        }
        catch (JsonException)
        {
            attributes = new();
        }

        return new ProductResponseDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            Name = product.Name,
            Brand = product.Brand,
            Attributes = attributes,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt
        };
    }
}
