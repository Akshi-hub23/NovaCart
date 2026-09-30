using Microsoft.EntityFrameworkCore;
using NovaCart.API.Data;
using NovaCart.API.DTOs;
using NovaCart.API.Models;

namespace NovaCart.API.Services;

public class AddressService
{
    private readonly NovaCartDbContext _context;

    public AddressService(NovaCartDbContext context)
    {
        _context = context;
    }

    public async Task<AddressResponseDto> CreateAddressAsync(
        int userId,
        AddressCreateDto dto)
    {
        var address = new Address
        {
            UserId = userId,
            FullName = dto.FullName,
            AddressLine = dto.AddressLine,
            City = dto.City,
            State = dto.State,
            PostalCode = dto.PostalCode,
            Country = dto.Country
        };

        _context.Addresses.Add(address);

        await _context.SaveChangesAsync();

        return new AddressResponseDto
        {
            Id = address.Id,
            FullName = address.FullName,
            AddressLine = address.AddressLine,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country
        };
    }

    public async Task<List<AddressResponseDto>> GetUserAddressesAsync(
        int userId)
    {
        return await _context.Addresses
            .Where(address => address.UserId == userId)
            .Select(address => new AddressResponseDto
            {
                Id = address.Id,
                FullName = address.FullName,
                AddressLine = address.AddressLine,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
            })
            .ToListAsync();
    }

    public async Task<AddressResponseDto?> GetAddressByIdAsync(
    int userId,
    int addressId)
    {
        return await _context.Addresses
            .Where(address =>
                address.Id == addressId &&
                address.UserId == userId)
            .Select(address => new AddressResponseDto
            {
                Id = address.Id,
                FullName = address.FullName,
                AddressLine = address.AddressLine,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
            })
            .FirstOrDefaultAsync();
    }

    public async Task<AddressResponseDto?> UpdateAddressAsync(
    int userId,
    int addressId,
    AddressUpdateDto dto)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(address =>
                address.Id == addressId &&
                address.UserId == userId);

        if (address is null)
        {
            return null;
        }

        address.FullName = dto.FullName;
        address.AddressLine = dto.AddressLine;
        address.City = dto.City;
        address.State = dto.State;
        address.PostalCode = dto.PostalCode;
        address.Country = dto.Country;

        await _context.SaveChangesAsync();

        return new AddressResponseDto
        {
            Id = address.Id,
            FullName = address.FullName,
            AddressLine = address.AddressLine,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country
        };
    }

    public async Task<bool> DeleteAddressAsync(
    int userId,
    int addressId)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(address =>
                address.Id == addressId &&
                address.UserId == userId);

        if (address is null)
        {
            return false;
        }

        _context.Addresses.Remove(address);

        await _context.SaveChangesAsync();

        return true;
    }
}