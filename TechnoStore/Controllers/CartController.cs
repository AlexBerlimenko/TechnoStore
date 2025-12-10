using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TechnoStore.Data;
using TechnoStore.Models;

namespace TechnoStore.Controllers
{
    [ApiController]
    [Route("cart")]
    [Authorize] // пользователь ДОЛЖЕН быть авторизован
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CartController(AppDbContext db)
        {
            _db = db;
        }

        // Получаем id пользователя из токена
        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        // GET /cart  → получить корзину
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            int userId = GetUserId();

            var items = await _db.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(items);
        }

        // POST /cart/add добавить товар
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(int productId, int quantity = 1)
        {
            int userId = GetUserId();

            // Проверка: товар существует?
            var product = await _db.Products.FindAsync(productId);
            if (product == null)
                return NotFound("Product not found");

            // Проверка: товар уже в корзине?
            var existing = await _db.CartItems
                .FirstOrDefaultAsync(c => c.ProductId == productId && c.UserId == userId);

            if (existing != null)
            {
                existing.Quantity += quantity;
            }
            else
            {
                _db.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = quantity
                });
            }

            await _db.SaveChangesAsync();
            return Ok("Added to cart");
        }

        // PUT /cart/update изменить количество
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuantity(int itemId, int quantity)
        {
            int userId = GetUserId();

            var item = await _db.CartItems
                .FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);

            if (item == null)
                return NotFound("Cart item not found");

            item.Quantity = quantity;
            await _db.SaveChangesAsync();

            return Ok(item);
        }

        // DELETE /cart/remove  → удалить товар
        [HttpDelete("remove")]
        public async Task<IActionResult> Remove(int itemId)
        {
            int userId = GetUserId();

            var item = await _db.CartItems
                .FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);

            if (item == null)
                return NotFound();

            _db.CartItems.Remove(item);
            await _db.SaveChangesAsync();

            return Ok("Item removed");
        }

        // DELETE /cart/clear очистить корзину
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            int userId = GetUserId();

            var items = await _db.CartItems.Where(c => c.UserId == userId).ToListAsync();

            _db.CartItems.RemoveRange(items);
            await _db.SaveChangesAsync();

            return Ok("Cart cleared");
        }
    }
}
