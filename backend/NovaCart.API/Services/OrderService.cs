
using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class OrderService
{
    private static readonly string[] ValidPaymentMethods =
    {
        "Cash on Delivery", "UPI", "Credit / Debit Card", "Net Banking"
    };

    private static readonly string[] ValidOrderStatuses =
    {
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    };

    private readonly NovaCartDbContext _context;

    public OrderService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponseDto?> CreateOrderAsync(
        int userId,
        OrderCreateDto dto)
    {
        if (!ValidPaymentMethods.Contains(dto.PaymentMethod))
        {
            throw new ArgumentException("Invalid payment method.");
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // Check that the address exists
            // and belongs to the logged-in user.
            var address = await _context.Addresses
                .FirstOrDefaultAsync(address =>
                    address.Id == dto.AddressId &&
                    address.UserId == userId);

            if (address is null)
            {
                await transaction.RollbackAsync();
                return null;
            }

            // Get the user's cart with products.
            var cart = await _context.Carts
                .Include(cart => cart.CartItems)
                    .ThenInclude(cartItem => cartItem.Product)
                .FirstOrDefaultAsync(cart => cart.UserId == userId);

            if (cart is null || !cart.CartItems.Any())
            {
                return null;
            }

            // Validate products and stock.
            foreach (var cartItem in cart.CartItems)
            {
                if (!cartItem.Product.IsActive)
                {
                    return null;
                }

                if (cartItem.Quantity > cartItem.Product.StockQuantity)
                {
                    return null;
                }
            }

            // Create the order.
            var order = new Order
            {
                UserId = userId,
                AddressId = dto.AddressId,
                Status = "Pending",
                PaymentMethod = dto.PaymentMethod,
                CreatedAt = DateTime.UtcNow
            };

            // Create order items.
            foreach (var cartItem in cart.CartItems)
            {
                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Product.Price,
                    Subtotal = cartItem.Product.Price * cartItem.Quantity
                };

                // Reduce product stock.
                cartItem.Product.StockQuantity -= cartItem.Quantity;

                order.OrderItems.Add(orderItem);
            }

            // Calculate total order amount.
            order.TotalAmount = order.OrderItems
                .Sum(orderItem => orderItem.Subtotal);

            _context.Orders.Add(order);

            // Empty the cart after creating the order.
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            // Return the created order.
            return new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt,

                Address = new AddressResponseDto
                {
                    Id = address.Id,
                    FullName = address.FullName,
                    AddressLine = address.AddressLine,
                    City = address.City,
                    State = address.State,
                    PostalCode = address.PostalCode,
                    Country = address.Country
                },

                Items = order.OrderItems
                    .Select(orderItem => new OrderItemResponseDto
                    {
                        Id = orderItem.Id,
                        ProductId = orderItem.ProductId,
                        ProductName = orderItem.Product.Name,
                        Quantity = orderItem.Quantity,
                        UnitPrice = orderItem.UnitPrice,
                        Subtotal = orderItem.Subtotal
                    })
                    .ToList()
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(
        int orderId,
        int userId)
    {
        var order = await _context.Orders
            .Include(order => order.Address)
            .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Product)
            .FirstOrDefaultAsync(
                order => order.Id == orderId &&
                         order.UserId == userId);

        if (order is null)
        {
            return null;
        }

        return new OrderResponseDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            CreatedAt = order.CreatedAt,

            Address = order.Address is null
                ? null
                : new AddressResponseDto
                {
                    Id = order.Address.Id,
                    FullName = order.Address.FullName,
                    AddressLine = order.Address.AddressLine,
                    City = order.Address.City,
                    State = order.Address.State,
                    PostalCode = order.Address.PostalCode,
                    Country = order.Address.Country
                },

            Items = order.OrderItems
                .Select(orderItem => new OrderItemResponseDto
                {
                    Id = orderItem.Id,
                    ProductId = orderItem.ProductId,
                    ProductName = orderItem.Product.Name,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    Subtotal = orderItem.Subtotal
                })
                .ToList()
        };
    }

    public async Task<List<OrderResponseDto>> GetMyOrdersAsync(
        int userId)
    {
        var orders = await _context.Orders
            .Include(order => order.Address)
            .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Product)
            .Where(order => order.UserId == userId)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync();

        return orders
            .Select(order => new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt,

                Address = order.Address is null
                    ? null
                    : new AddressResponseDto
                    {
                        Id = order.Address.Id,
                        FullName = order.Address.FullName,
                        AddressLine = order.Address.AddressLine,
                        City = order.Address.City,
                        State = order.Address.State,
                        PostalCode = order.Address.PostalCode,
                        Country = order.Address.Country
                    },

                Items = order.OrderItems
                    .Select(orderItem => new OrderItemResponseDto
                    {
                        Id = orderItem.Id,
                        ProductId = orderItem.ProductId,
                        ProductName = orderItem.Product.Name,
                        Quantity = orderItem.Quantity,
                        UnitPrice = orderItem.UnitPrice,
                        Subtotal = orderItem.Subtotal
                    })
                    .ToList()
            })
            .ToList();
    }

    public async Task<List<OrderResponseDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(order => order.Address)
            .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Product)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync();

        return orders
            .Select(order => new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt,

                Address = order.Address is null
                    ? null
                    : new AddressResponseDto
                    {
                        Id = order.Address.Id,
                        FullName = order.Address.FullName,
                        AddressLine = order.Address.AddressLine,
                        City = order.Address.City,
                        State = order.Address.State,
                        PostalCode = order.Address.PostalCode,
                        Country = order.Address.Country
                    },

                Items = order.OrderItems
                    .Select(orderItem => new OrderItemResponseDto
                    {
                        Id = orderItem.Id,
                        ProductId = orderItem.ProductId,
                        ProductName = orderItem.Product.Name,
                        Quantity = orderItem.Quantity,
                        UnitPrice = orderItem.UnitPrice,
                        Subtotal = orderItem.Subtotal
                    })
                    .ToList()
            })
            .ToList();
    }

    public async Task<OrderResponseDto?> UpdateOrderStatusAsync(
        int orderId,
        string status)
    {
        var order = await _context.Orders
            .Include(order => order.Address)
            .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Product)
            .FirstOrDefaultAsync(order => order.Id == orderId);

        if (order is null)
        {
            return null;
        }

        var validStatus = ValidOrderStatuses
            .FirstOrDefault(
                validStatus => validStatus.Equals(
                    status,
                    StringComparison.OrdinalIgnoreCase));

        if (validStatus is null)
        {
            throw new ArgumentException(
                "Invalid order status.");
        }

        if (order.Status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) &&
            !validStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("A cancelled order cannot be reopened.");
        }

        if (order.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase) &&
            validStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("A delivered order cannot be cancelled.");
        }

        var currentStep = Array.FindIndex(
            ValidOrderStatuses.Take(5).ToArray(),
            step => step.Equals(order.Status, StringComparison.OrdinalIgnoreCase));
        var requestedStep = Array.FindIndex(
            ValidOrderStatuses.Take(5).ToArray(),
            step => step.Equals(validStatus, StringComparison.OrdinalIgnoreCase));
        if (!validStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) &&
            !validStatus.Equals(order.Status, StringComparison.OrdinalIgnoreCase) &&
            (currentStep < 0 || requestedStep != currentStep + 1))
        {
            throw new ArgumentException("Order status must move to the next fulfillment step.");
        }

        if (!order.Status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) &&
            validStatus.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            foreach (var orderItem in order.OrderItems)
            {
                orderItem.Product.StockQuantity += orderItem.Quantity;
            }
        }

        order.Status = validStatus;

        await _context.SaveChangesAsync();

        return new OrderResponseDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            CreatedAt = order.CreatedAt,

            Address = order.Address is null
                ? null
                : new AddressResponseDto
                {
                    Id = order.Address.Id,
                    FullName = order.Address.FullName,
                    AddressLine = order.Address.AddressLine,
                    City = order.Address.City,
                    State = order.Address.State,
                    PostalCode = order.Address.PostalCode,
                    Country = order.Address.Country
                },

            Items = order.OrderItems
                .Select(orderItem => new OrderItemResponseDto
                {
                    Id = orderItem.Id,
                    ProductId = orderItem.ProductId,
                    ProductName = orderItem.Product.Name,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    Subtotal = orderItem.Subtotal
                })
                .ToList()
        };
    }
}

