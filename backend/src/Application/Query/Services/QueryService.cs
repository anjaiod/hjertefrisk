using backend.src.Application.Queries.DTOs;
using backend.src.Application.Queries.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Queries.Services;

public class QueryService : IQueryService
{
    private readonly AppDbContext _db;

    public QueryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<QueryDto>> GetAllAsync()
    {
        return await _db.Queries
            .AsNoTracking()
            .Select(q => new QueryDto { Id = q.Id, Name = q.Name })
            .ToListAsync();
    }

    public async Task<QueryDto?> GetByIdAsync(int id)
    {
        return await _db.Queries
            .AsNoTracking()
            .Where(q => q.Id == id)
            .Select(q => new QueryDto { Id = q.Id, Name = q.Name })
            .FirstOrDefaultAsync();
    }

    public async Task<QueryDto> CreateAsync(CreateQueryDto dto)
    {
        var entity = new Query { Name = dto.Name };
        _db.Queries.Add(entity);
        await _db.SaveChangesAsync();
        return new QueryDto { Id = entity.Id, Name = entity.Name };
    }
}