using Microsoft.AspNetCore.Mvc;
using TechnoStore.Data;
using TechnoStore.Models;
using TechnoStore.Services;
using Microsoft.EntityFrameworkCore;

namespace TechnoStore.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly AuthService _auth;

        public AuthController(AppDbContext db, AuthService auth)
        {
            _db = db;
            _auth = auth;
        }

        // ---------------------------
        // POST: /auth/register
        // ---------------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Пользователь с таким email уже существует.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Role = "user", // обычный пользователь
                PasswordHash = _auth.HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok("Регистрация успешна.");
        }

        // ---------------------------
        // POST: /auth/login
        // ---------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _auth.ValidateUser(dto.Email, dto.Password);
            if (user == null)
                return Unauthorized("Неправильный логин или пароль.");

            var token = _auth.GenerateJwtToken(user);

            return Ok(new
            {
                token,
                role = user.Role,
                email = user.Email
            });
        }
    }

    // DTO для регистрации
    public class RegisterDto
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Password { get; set; } = "";
    }

    // DTO для логина
    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
