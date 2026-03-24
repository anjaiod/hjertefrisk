using backend.src.Application.Responses.DTOs;

namespace backend.src.Application.Responses.Interfaces;

public interface IResponseService
{
    Task<IEnumerable<ResponseDto>> GetAllAsync();
    Task<ResponseDto> CreateAsync(CreateResponseDto dto);
    Task<IEnumerable<ResponseDto>> UpsertManyAsync(IEnumerable<CreateResponseDto> dtos);
    Task<IEnumerable<AnsweredQueryHistoryDto>> GetHistoryForPatientAsync(int patientId);
}
