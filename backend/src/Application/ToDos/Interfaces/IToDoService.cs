using backend.src.Application.ToDos.DTOs;

namespace backend.src.Application.ToDos.Interfaces;

public interface IToDoService
{
    Task<IEnumerable<ToDoDto>> GetAllAsync(int? currentPersonnelId = null);
    Task<ToDoDto> CreateAsync(CreateToDoDto dto);
    Task<ToDoDto?> GetByIdAsync(int id);
    Task<ToDoDto?> UpdateAsync(int id, CreateToDoDto dto, int? personnelId = null);
    Task<bool> DeleteAsync(int id, int? personnelId = null);
}
