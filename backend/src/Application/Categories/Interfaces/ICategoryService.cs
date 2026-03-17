using backend.src.Application.Categories.DTOs;

namespace backend.src.Application.Categories.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
}
