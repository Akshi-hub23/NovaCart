using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class ReviewService
{
    private readonly NovaCartDbContext _context;

    public ReviewService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<ReviewResponseDto?> CreateReviewAsync(
        int userId,
        int productId,
        ReviewCreateDto dto)
    {
        var productExists = await _context.Products
            .AnyAsync(product => product.Id == productId);

        if (!productExists)
        {
            return null;
        }

        var existingReview = await _context.Reviews
            .AnyAsync(review =>
                review.UserId == userId &&
                review.ProductId == productId);

        if (existingReview)
        {
            return null;
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Id == userId);

        if (user is null)
        {
            return null;
        }

        var review = new Review
        {
            UserId = userId,
            ProductId = productId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        return new ReviewResponseDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = user.Name,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<List<ReviewResponseDto>> GetProductReviewsAsync(
    int productId)
    {
        var reviews = await _context.Reviews
            .Include(review => review.User)
            .Where(review => review.ProductId == productId)
            .OrderByDescending(review => review.CreatedAt)
            .ToListAsync();

        return reviews
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = review.User.Name,
                ProductId = review.ProductId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .ToList();
    }

    public async Task<ProductRatingResponseDto> GetProductRatingAsync(
    int productId)
    {
        var ratings = await _context.Reviews
            .Where(review => review.ProductId == productId)
            .Select(review => review.Rating)
            .ToListAsync();

        if (!ratings.Any())
        {
            return new ProductRatingResponseDto
            {
                ProductId = productId,
                AverageRating = 0,
                ReviewCount = 0
            };
        }

        return new ProductRatingResponseDto
        {
            ProductId = productId,
            AverageRating = Math.Round(
                ratings.Average(),
                1),
            ReviewCount = ratings.Count
        };
    }

    public async Task<ReviewResponseDto?> UpdateReviewAsync(
    int reviewId,
    int userId,
    ReviewCreateDto dto)
    {
        var review = await _context.Reviews
            .Include(review => review.User)
            .FirstOrDefaultAsync(review =>
                review.Id == reviewId &&
                review.UserId == userId);

        if (review is null)
        {
            return null;
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _context.SaveChangesAsync();

        return new ReviewResponseDto
        {
            Id = review.Id,
            UserId = review.UserId,
            UserName = review.User.Name,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<bool> DeleteReviewAsync(
    int reviewId,
    int userId)
    {
        var review = await _context.Reviews
            .FirstOrDefaultAsync(review =>
                review.Id == reviewId &&
                review.UserId == userId);

        if (review is null)
        {
            return false;
        }

        _context.Reviews.Remove(review);

        await _context.SaveChangesAsync();

        return true;
    }
}