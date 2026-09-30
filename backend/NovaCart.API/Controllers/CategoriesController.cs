using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NovaCart.API.DTOs;
using NovaCart.API.Services;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryService.GetCategoriesAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory(
    [FromBody] CategoryCreateDto dto)
    {
        CategoryResponseDto category;
        try { category = await _categoryService.CreateCategoryAsync(dto); }
        catch (ArgumentException exception) { return BadRequest(new { message = exception.Message }); }

        return CreatedAtAction(
            nameof(GetCategoryById),
            new { id = category.Id },
            category);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(
    int id,
    [FromBody] CategoryUpdateDto dto)
    {
        CategoryResponseDto? category;
        try { category = await _categoryService.UpdateCategoryAsync(id, dto); }
        catch (ArgumentException exception) { return BadRequest(new { message = exception.Message }); }

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _categoryService.DeleteCategoryAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
