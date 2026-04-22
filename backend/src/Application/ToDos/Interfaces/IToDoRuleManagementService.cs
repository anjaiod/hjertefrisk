using backend.src.Application.ToDos.DTOs;

namespace backend.src.Application.ToDos.Interfaces;

public interface IToDoRuleManagementService
{
    Task<IEnumerable<ToDoRuleDto>> GetAllAsync();
    Task<ToDoRuleDto?> GetByIdAsync(int id);
    Task<IEnumerable<ToDoRuleDto>> GetByQuestionAsync(int questionId);
    Task<IEnumerable<ToDoRuleDto>> GetByCategoryAsync(int categoryId);
    Task<ToDoRuleDto> CreateAsync(CreateToDoRuleDto dto);
    Task<ToDoRuleDto> UpdateAsync(int id, CreateToDoRuleDto dto);
    Task DeleteAsync(int id);
}
