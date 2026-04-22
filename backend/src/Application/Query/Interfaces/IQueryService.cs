using backend.src.Application.Queries.DTOs;

namespace backend.src.Application.Queries.Interfaces;

public interface IQueryService
{
    Task<IEnumerable<QueryDto>> GetAllAsync();
    Task<QueryDto?> GetByIdAsync(int id);
    Task<QueryDto> CreateAsync(CreateQueryDto dto);

    Task<QueryWithQuestionsDto?> GetWithQuestionsAsync(int id);

    Task<QueryWithQuestionsDto?> GetByNameAsync(string name);
}