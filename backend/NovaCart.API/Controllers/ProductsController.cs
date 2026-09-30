using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NovaCart.API.DTOs;
using NovaCart.API.Services;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly HashSet<string> SupportedAttributeKeys = new(StringComparer.Ordinal)
    {
        "gender", "productType", "size", "color", "ramGb", "storageGb", "batteryMah",
        "supports5G", "network", "operatingSystem", "processor", "screenSizeInches", "connectionType",
        "skinType", "shade", "ageGroup", "capacity", "energyRating", "dietary", "finish", "spf",
        "material", "weight", "features", "packSize", "foodType", "displayType", "measurementType",
        "bluetooth", "noiseCancellation", "dpi", "fastCharging", "discountPercent"
    };

    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category,
        [FromQuery] int? categoryId,
        [FromQuery] string? subcategory,
        [FromQuery] string? gender,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int? rating,
        [FromQuery] bool? available,
        [FromQuery] string? attributeKey,
        [FromQuery] string? attributeValue)
    {
        if (minPrice < 0 || maxPrice < 0 || (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice))
            return BadRequest(new { message = "Price filters are invalid." });
        if (rating is < 1 or > 5) return BadRequest(new { message = "Rating must be between 1 and 5." });
        if (categoryId is <= 0) return BadRequest(new { message = "Category ID must be positive." });
        if (string.IsNullOrWhiteSpace(attributeKey) != string.IsNullOrWhiteSpace(attributeValue))
            return BadRequest(new { message = "Attribute key and value must be supplied together." });
        if (attributeKey?.Length > 50 || attributeValue?.Length > 100)
            return BadRequest(new { message = "Attribute filters are too long." });
        var selectedCategory = categoryId?.ToString() ?? category;
        var products = await _productService.GetProductsAsync(selectedCategory, subcategory ?? gender, brand, minPrice, maxPrice, rating, available, attributeKey, attributeValue);

        return Ok(products);
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(ProductCreateDto dto)
    {
        if (!HasValidAttributes(dto.Attributes)) return BadRequest(new { message = "Product attributes contain unsupported keys or values." });
        var product = await _productService.CreateProductAsync(dto);

        if (product is null)
        {
            return NotFound("Category not found.");
        }

        return CreatedAtAction(
            nameof(GetProductById),
            new { id = product.Id },
            product);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(
    int id,
    ProductUpdateDto dto)
    {
        if (!HasValidAttributes(dto.Attributes)) return BadRequest(new { message = "Product attributes contain unsupported keys or values." });
        var product = await _productService.UpdateProductAsync(id, dto);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productService.DeleteProductAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static bool HasValidAttributes(Dictionary<string, string>? attributes) =>
        attributes is not null && attributes.Count <= 24 && attributes.All(attribute =>
            SupportedAttributeKeys.Contains(attribute.Key)
            && !string.IsNullOrWhiteSpace(attribute.Value)
            && attribute.Value.Length <= 100);

}
