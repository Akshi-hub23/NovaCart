using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaCart.API.DTOs;
using NovaCart.API.Services;
using System.Security.Claims;

namespace NovaCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressController : ControllerBase
{
    private readonly AddressService _addressService;

    public AddressController(AddressService addressService)
    {
        _addressService = addressService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAddress(
        AddressCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var address = await _addressService.CreateAddressAsync(
            userId,
            dto);

        return CreatedAtAction(
            nameof(GetUserAddresses),
            null,
            address);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserAddresses()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var addresses = await _addressService.GetUserAddressesAsync(
            userId);

        return Ok(addresses);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAddressById(int id)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var address = await _addressService.GetAddressByIdAsync(
            userId,
            id);

        if (address is null)
        {
            return NotFound(new
            {
                message = "Address not found."
            });
        }

        return Ok(address);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAddress(
    int id,
    AddressUpdateDto dto)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var address = await _addressService.UpdateAddressAsync(
            userId,
            id,
            dto);

        if (address is null)
        {
            return NotFound(new
            {
                message = "Address not found."
            });
        }

        return Ok(address);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var deleted = await _addressService.DeleteAddressAsync(
            userId,
            id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Address not found."
            });
        }

        return NoContent();
    }
}