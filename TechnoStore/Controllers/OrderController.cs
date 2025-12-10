using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TechnoStore.Data;
using TechnoStore.Models;

namespace TechnoStore.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrderController(AppDbContext db)
        {
            _db = db;
        }

        // ADMIN: Получить все заказы
        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .ToListAsync();

            return Ok(orders);
        }

        // USER: Получить свои заказы
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyOrders()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .ToListAsync();

            return Ok(orders);
        }

        // USER: Оформить заказ
        [HttpPost("checkout")]
        [Authorize]
        public async Task<IActionResult> Checkout()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var cart = await _db.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .ToListAsync();

            if (!cart.Any())
                return BadRequest("Корзина пуста.");

            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Status = "Новий"
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var items = cart.Select(c => new OrderItem
            {
                OrderId = order.Id,
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                PriceAtMoment = c.Product.Price
            }).ToList();

            _db.OrderItems.AddRange(items);
            _db.CartItems.RemoveRange(cart);

            await _db.SaveChangesAsync();

            order.Items = items;

            return Ok(order);
        }

        // ADMIN: Удалить один заказ
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Заказ не найден");

            _db.OrderItems.RemoveRange(order.Items);
            _db.Orders.Remove(order);

            await _db.SaveChangesAsync();

            return Ok($"Заказ #{id} успешно удалён.");
        }

        // ADMIN: Удалить ВСЕ заказы
        [HttpDelete("all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteAllOrders()
        {
            var items = await _db.OrderItems.ToListAsync();
            var orders = await _db.Orders.ToListAsync();

            _db.OrderItems.RemoveRange(items);
            _db.Orders.RemoveRange(orders);

            await _db.SaveChangesAsync();

            return Ok("Все заказы удалены.");
        }

        // ADMIN: Обновить статус заказа
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] string status)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Заказ не найден.");

            var allowedStatuses = new[]
            {
                "Новий", "Обробляється", "Відправлено", "Завершено"
            };

            if (!allowedStatuses.Contains(status))
                return BadRequest("Неприпустимий статус.");

            order.Status = status;
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Статус змінено",
                newStatus = status
            });
        }
    }
}
