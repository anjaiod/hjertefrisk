using backend.src.Application.Patients.DTOs;

namespace backend.src.Application.Patients.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<PatientDto> CreateAsync(CreatePatientDto dto);
    Task<PatientDto?> GetBySupabaseUserIdAsync(string supabaseUserId);
    Task<int> GetTotalScoreAsync(int patientId);
    Task<IEnumerable<LatestMeasurementResultDto>> GetLatestMeasurementsAsync(int patientId);
}
