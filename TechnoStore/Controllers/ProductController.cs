using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechnoStore.Data;
using TechnoStore.Models;

namespace TechnoStore.Controllers
{
    [ApiController]
    [Route("products")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductController(AppDbContext db)
        {
            _db = db;
        }

        // GET /products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _db.Products
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryId,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Slug
                    }
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET /products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryId,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Slug
                    }
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();

            return Ok(product);
        }

        // GET /products/by-category/{slug}
        [HttpGet("by-category/{slug}")]
        public async Task<IActionResult> GetByCategory(string slug)
        {
            var category = await _db.Categories
                .FirstOrDefaultAsync(c => c.Slug == slug);

            if (category == null) return NotFound();

            var products = await _db.Products
                .Where(p => p.CategoryId == category.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryId
                })
                .ToListAsync();

            return Ok(products);
        }

        // POST /products (ADMIN)
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create(Product dto)
        {
            var category = await _db.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Категорія не знайдена");

            _db.Products.Add(dto);
            await _db.SaveChangesAsync();

            return Ok(dto);
        }

        // PUT /products/{id} (ADMIN)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, Product dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;

            await _db.SaveChangesAsync();
            return Ok(product);
        }

        // DELETE /products/{id} (ADMIN)
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return Ok("Товар видалено.");
        }
    }
}
