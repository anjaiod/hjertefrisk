using backend.src.Application.Categories.DTOs;
using backend.src.Application.Categories.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Categories.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        return await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Name = c.Name
            })
            .ToListAsync();
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var name = dto.Name.Trim();

        var exists = await _db.Categories.AnyAsync(c => c.Name == name);
        if (exists)
        {
            throw new InvalidOperationException($"A category with the name '{name}' already exists.");
        }

        var entity = new Category
        {
            Name = name
        };

        _db.Categories.Add(entity);
        await _db.SaveChangesAsync();

        return new CategoryDto
        {
            CategoryId = entity.CategoryId,
            Name = entity.Name
        };
    }
}
