using backend.src.Application.ToDos.DTOs;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Domain.Models;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.ToDos.Services;

public class ToDoService : IToDoService
{
    private readonly AppDbContext _db;

    public ToDoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ToDoDto>> GetAllAsync()
    {
        return await _db.ToDos
            .AsNoTracking()
            .Select(t => new ToDoDto
            {
                ToDoId = t.ToDoId,
                Finished = t.Finished,
                ToDoText = t.ToDoText,
                PatientId = t.PatientId,
                PersonnelId = t.PersonnelId,
                Public = t.Public
            })
            .ToListAsync();
    }

    public async Task<ToDoDto> CreateAsync(CreateToDoDto dto)
    {
        var entity = new ToDo
        {
            ToDoText = dto.ToDoText.Trim(),
            PatientId = dto.PatientId,
            PersonnelId = dto.PersonnelId,
            Finished = dto.Finished,
            Public = dto.Public
        };

        _db.ToDos.Add(entity);
        await _db.SaveChangesAsync();

        return new ToDoDto
        {
            ToDoId = entity.ToDoId,
            Finished = entity.Finished,
            ToDoText = entity.ToDoText,
            PatientId = entity.PatientId,
            PersonnelId = entity.PersonnelId,
            Public = entity.Public
        };
    }
}
