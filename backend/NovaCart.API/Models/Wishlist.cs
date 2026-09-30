namespace NovaCart.API.Models;

public class Wishlist
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User? User { get; set; }

    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
