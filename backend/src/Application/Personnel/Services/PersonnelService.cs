using backend.src.Application.Personnel.DTOs;
using backend.src.Application.Personnel.Interfaces;
using PersonnelEntity = backend.src.Domain.Models.Personnel;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Personnel.Services;

public class PersonnelService : IPersonnelService
{
    private readonly AppDbContext _db;

    public PersonnelService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PersonnelDto>> GetAllAsync()
    {
        return await _db.Personnel
            .AsNoTracking()
            .Select(p => new PersonnelDto
            {
                Id = p.Id,
                SupabaseUserId = p.SupabaseUserId,
                Name = p.Name,
                Email = p.Email,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<PersonnelDto> CreateAsync(CreatePersonnelDto dto)
    {
        var entity = new PersonnelEntity
        {
            SupabaseUserId = dto.SupabaseUserId.Trim(),
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim()
        };

        _db.Personnel.Add(entity);
        await _db.SaveChangesAsync();

        return new PersonnelDto
        {
            Id = entity.Id,
            SupabaseUserId = entity.SupabaseUserId,
            Name = entity.Name,
            Email = entity.Email,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<PersonnelDto?> GetBySupabaseUserIdAsync(string supabaseUserId)
    {
        var trimmed = supabaseUserId.Trim();
        if (string.IsNullOrWhiteSpace(trimmed)) return null;

        return await _db.Personnel
            .AsNoTracking()
            .Where(p => p.SupabaseUserId == trimmed)
            .Select(p => new PersonnelDto
            {
                Id = p.Id,
                SupabaseUserId = p.SupabaseUserId,
                Name = p.Name,
                Email = p.Email,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync();
    }
}
