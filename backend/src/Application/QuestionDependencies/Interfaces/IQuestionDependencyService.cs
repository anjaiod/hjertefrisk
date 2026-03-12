using backend.src.Application.QuestionDependencies.DTOs;

namespace backend.src.Application.QuestionDependencies.Interfaces;

public interface IQuestionDependencyService
{
    Task<IEnumerable<QuestionDependencyDto>> GetAllAsync();
    Task<QuestionDependencyDto> CreateAsync(CreateQuestionDependencyDto dto);
}
