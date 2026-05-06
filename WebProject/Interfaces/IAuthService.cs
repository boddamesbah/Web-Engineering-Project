using WebProject.DTOs;

namespace WebProject.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<UserDto?> GetUserByIdAsync(int id);
}
