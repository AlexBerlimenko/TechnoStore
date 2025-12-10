using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechnoStore.Data;
using TechnoStore.Models;

namespace TechnoStore.Controllers
{
    [ApiController]
    [Route("categories")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoryController(AppDbContext db)
        {
            _db = db;
        }

        // GET /categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _db.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET /categories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST /categories (admin)
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create(Category dto)
        {
            _db.Categories.Add(dto);
            await _db.SaveChangesAsync();
            return Ok(dto);
        }

        // PUT /categories/{id} (admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, Category dto)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.Slug = dto.Slug;

            await _db.SaveChangesAsync();
            return Ok(category);
        }

        // DELETE /categories/{id} (admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();

            return Ok("Категорію видалено.");
        }
    }
}
