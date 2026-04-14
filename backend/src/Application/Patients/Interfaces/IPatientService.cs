using backend.src.Application.MeasurementResults.DTOs;
using backend.src.Application.Patients.DTOs;

namespace backend.src.Application.Patients.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<IEnumerable<PatientDto>> GetByIdsAsync(IEnumerable<int> ids);
    Task<PagedResult<PatientDto>> GetPagedByIdsAsync(IEnumerable<int> ids, int page, int pageSize, string? search, string? sortBy, string? sortDir, string? riskLevel, int? personnelId = null);
    Task RecordVisitAsync(int patientId, int personnelId);
    Task UpdateRiskLevelAsync(int patientId, string? riskLevel);
    Task<PatientDto?> GetByIdAsync(int id);
    Task<PatientDto?> GetBySupabaseUserIdAsync(string supabaseUserId);
    Task<PatientDto> CreateAsync(CreatePatientDto dto);
    Task<int> GetTotalScoreAsync(int patientId);
    Task<IEnumerable<LatestMeasurementResultDto>> GetLatestMeasurementsAsync(int patientId);
    Task<IEnumerable<MeasurementResultDto>> GetAllMeasurementsAsync(int patientId);
}
