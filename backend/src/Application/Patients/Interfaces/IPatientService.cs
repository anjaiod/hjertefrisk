using backend.src.Application.Patients.DTOs;

namespace backend.src.Application.Patients.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllAsync();
    Task<PatientDto?> GetBySupabaseUserIdAsync(string supabaseUserId);
    Task<PatientDto> CreateAsync(CreatePatientDto dto);
    Task<int> GetTotalScoreAsync(int patientId);
}
