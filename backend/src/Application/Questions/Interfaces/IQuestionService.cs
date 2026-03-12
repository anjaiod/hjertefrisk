using backend.src.Application.Questions.DTOs;

namespace backend.src.Application.Questions.Interfaces;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDto>> GetAllAsync();
    Task<QuestionDto> CreateAsync(CreateQuestionDto dto);
}
