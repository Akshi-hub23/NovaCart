using Microsoft.EntityFrameworkCore;
using NovaCart.API.Models;

namespace NovaCart.API.Data;

public class NovaCartDbContext : DbContext
{
    public NovaCartDbContext(DbContextOptions<NovaCartDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Cart> Carts { get; set; }

    public DbSet<CartItem> CartItems { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    public DbSet<Address> Addresses { get; set; }

    public DbSet<Review> Reviews { get; set; }
    
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>()
            .HasOne(product => product.Category)
            .WithMany()
            .HasForeignKey(product => product.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Category>()
            .HasOne(category => category.ParentCategory)
            .WithMany(category => category.Subcategories)
            .HasForeignKey(category => category.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasOne(user => user.Cart)
            .WithOne(cart => cart.User)
            .HasForeignKey<Cart>(cart => cart.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Cart>()
            .ToTable("Cart");
        modelBuilder.Entity<Cart>()
            .HasMany(cart => cart.CartItems)
            .WithOne(cartItem => cartItem.Cart)
            .HasForeignKey(cartItem => cartItem.CartId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<CartItem>()
            .ToTable("CartItem");
        modelBuilder.Entity<CartItem>()
            .HasOne(cartItem => cartItem.Product)
            .WithMany()
            .HasForeignKey(cartItem => cartItem.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Order>()
            .ToTable("Order");
        modelBuilder.Entity<Order>()
            .HasOne(order => order.User)
            .WithMany(user => user.Orders)
            .HasForeignKey(order => order.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Order>()
           .HasOne(order => order.Address)
           .WithMany()
           .HasForeignKey(order => order.AddressId)
           .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<OrderItem>()
            .ToTable("OrderItem");
        modelBuilder.Entity<OrderItem>()
            .HasOne(orderItem => orderItem.Order)
            .WithMany(order => order.OrderItems)
            .HasForeignKey(orderItem => orderItem.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(orderItem => orderItem.Product)
            .WithMany(product => product.OrderItems)
            .HasForeignKey(orderItem => orderItem.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Address>()
            .HasOne(address => address.User)
            .WithMany(user => user.Addresses)
            .HasForeignKey(address => address.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .ToTable("Review");

        modelBuilder.Entity<Review>()
            .HasOne(review => review.User)
            .WithMany()
            .HasForeignKey(review => review.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(review => review.Product)
            .WithMany()
            .HasForeignKey(review => review.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasIndex(review => new
            {
                review.UserId,
                review.ProductId
            })
            .IsUnique();

        modelBuilder.Entity<Wishlist>()
            .ToTable("Wishlist");
        modelBuilder.Entity<Wishlist>()
            .HasOne(wishlist => wishlist.User)
            .WithOne(user => user.Wishlist)
            .HasForeignKey<Wishlist>(wishlist => wishlist.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Wishlist>()
            .HasMany(wishlist => wishlist.WishlistItems)
            .WithOne(item => item.Wishlist)
            .HasForeignKey(item => item.WishlistId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WishlistItem>()
            .ToTable("WishlistItem");
        modelBuilder.Entity<WishlistItem>()
            .HasOne(item => item.Product)
            .WithMany()
            .HasForeignKey(item => item.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<WishlistItem>()
            .HasIndex(item => new { item.WishlistId, item.ProductId })
            .IsUnique();
    }


}
