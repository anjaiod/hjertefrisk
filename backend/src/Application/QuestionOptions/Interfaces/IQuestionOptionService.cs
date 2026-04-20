using backend.src.Application.QuestionOptions.DTOs;

namespace backend.src.Application.QuestionOptions.Interfaces;

public interface IQuestionOptionService
{
    Task<IEnumerable<QuestionOptionDto>> GetAllAsync();
    Task<IEnumerable<QuestionOptionDto>> GetByQuestionIdAsync(int questionId);
    Task<QuestionOptionDto> CreateAsync(CreateQuestionOptionDto dto);
}
