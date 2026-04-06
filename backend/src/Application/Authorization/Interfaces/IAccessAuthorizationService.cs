namespace backend.src.Application.Authorization.Interfaces;

public interface IAccessAuthorizationService
{
    Task<bool> CanAccessPatientAsync(int personnelId, int patientId);
    Task<List<int>> GetAccessiblePatientIdsAsync(int personnelId);
    Task<int?> GetPersonnelIdBySupabaseIdAsync(string supabaseUserId);
    Task<int?> GetPatientIdBySupabaseIdAsync(string supabaseUserId);
}
