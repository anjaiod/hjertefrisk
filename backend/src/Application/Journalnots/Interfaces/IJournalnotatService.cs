using backend.src.Application.Journalnots.DTOs;

namespace backend.src.Application.Journalnots.Interfaces;

public interface IJournalnotatService
{
    Task<IEnumerable<JournalnotatDto>> GetByPatientIdAsync(int patientId, int personnelId);
    Task<JournalnotatDto> CreateAsync(CreateJournalnotatDto dto, int personnelId);
    Task<JournalnotatDto?> UpdateAsync(int id, UpdateJournalnotatDto dto, int personnelId);
    Task<bool> DeleteAsync(int id, int personnelId);
    Task<JournalnotatDto?> SignAsync(int id, int personnelId);
}
