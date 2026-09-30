using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class CategoryService
{
    private readonly NovaCartDbContext _context;

    public CategoryService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryResponseDto>> GetCategoriesAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Select(category => new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId
            })
            .ToListAsync();
    }

    public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int id)
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(category => category.Id == id)
            .Select(category => new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CategoryResponseDto> CreateCategoryAsync(
    CategoryCreateDto dto)
    {
        var category = new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description,
            ParentCategoryId = dto.ParentCategoryId
        };

        if (category.ParentCategoryId is int parentId && !await _context.Categories.AnyAsync(item => item.Id == parentId))
            throw new ArgumentException("Parent category was not found.");

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId
        };
    }

    public async Task<CategoryResponseDto?> UpdateCategoryAsync(
    int id,
    CategoryUpdateDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(category => category.Id == id);

        if (category is null)
        {
            return null;
        }

        if (dto.ParentCategoryId is int nextParent && (nextParent == id || await IsDescendantAsync(nextParent, id)))
            throw new ArgumentException("A category cannot be moved under itself or one of its descendants.");
        if (dto.ParentCategoryId is int parentId && !await _context.Categories.AnyAsync(item => item.Id == parentId))
            throw new ArgumentException("Parent category was not found.");
        category.Name = dto.Name.Trim();
        category.Description = dto.Description;
        category.ParentCategoryId = dto.ParentCategoryId;

        await _context.SaveChangesAsync();

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId
        };
    }

    private async Task<bool> IsDescendantAsync(int candidateId, int categoryId)
    {
        var categories = await _context.Categories.AsNoTracking()
            .Select(item => new { item.Id, item.ParentCategoryId }).ToListAsync();
        var currentId = candidateId;
        while (true)
        {
            var parentId = categories.FirstOrDefault(item => item.Id == currentId)?.ParentCategoryId;
            if (parentId is null) return false;
            if (parentId == categoryId) return true;
            currentId = parentId.Value;
        }
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(category => category.Id == id);

        if (category is null)
        {
            return false;
        }

        if (await _context.Products.AnyAsync(product => product.CategoryId == id)
            || await _context.Categories.AnyAsync(item => item.ParentCategoryId == id))
        {
            return false;
        }

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return true;
    }
}
