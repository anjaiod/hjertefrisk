using backend.src.Application.Authorization.Interfaces;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Authorization.Services;

public class AccessAuthorizationService : IAccessAuthorizationService
{
    private readonly AppDbContext _db;

    public AccessAuthorizationService(AppDbContext db) => _db = db;

    public async Task<bool> CanAccessPatientAsync(int personnelId, int patientId)
    {
        return await _db.PatientAccesses
            .AsNoTracking()
            .AnyAsync(pa => pa.PersonnelId == personnelId && pa.PatientId == patientId);
    }

    public async Task<List<int>> GetAccessiblePatientIdsAsync(int personnelId)
    {
        return await _db.PatientAccesses
            .AsNoTracking()
            .Where(pa => pa.PersonnelId == personnelId)
            .Select(pa => pa.PatientId)
            .ToListAsync();
    }

    public async Task<int?> GetPersonnelIdBySupabaseIdAsync(string supabaseUserId)
    {
        if (string.IsNullOrWhiteSpace(supabaseUserId)) return null;
        return await _db.Personnel
            .AsNoTracking()
            .Where(p => p.SupabaseUserId == supabaseUserId.Trim())
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<int?> GetPatientIdBySupabaseIdAsync(string supabaseUserId)
    {
        if (string.IsNullOrWhiteSpace(supabaseUserId)) return null;
        return await _db.Patients
            .AsNoTracking()
            .Where(p => p.SupabaseUserId == supabaseUserId.Trim())
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync();
    }
}
