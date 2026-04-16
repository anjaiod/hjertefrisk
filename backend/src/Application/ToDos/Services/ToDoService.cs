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

    public async Task<IEnumerable<ToDoDto>> GetAllAsync(int? currentPersonnelId = null)
    {
        var today = DateTime.UtcNow.Date;

        var query = _db.ToDos
            .AsNoTracking()
            .Where(t => !t.Finished || (t.FinishedAt != null && t.FinishedAt.Value.Date == today));

        // Filter based on Public flag and PersonnelId
        if (currentPersonnelId.HasValue)
        {
            // If personnel is accessing: show all public todos + their own private todos
            query = query.Where(t => t.Public || t.PersonnelId == currentPersonnelId.Value);
        }
        else
        {
            // If no personnel ID, only show public todos
            query = query.Where(t => t.Public);
        }

        return await query
            .Select(t => new ToDoDto
            {
                ToDoId = t.ToDoId,
                Finished = t.Finished,
                FinishedAt = t.FinishedAt,
                FinishedBy = t.FinishedBy,
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
            FinishedAt = dto.Finished ? DateTime.UtcNow : null,
            FinishedBy = dto.Finished ? dto.PersonnelId : null,
            Public = dto.Public
        };

        _db.ToDos.Add(entity);
        await _db.SaveChangesAsync();

        return new ToDoDto
        {
            ToDoId = entity.ToDoId,
            Finished = entity.Finished,
            FinishedAt = entity.FinishedAt,
            FinishedBy = entity.FinishedBy,
            ToDoText = entity.ToDoText,
            PatientId = entity.PatientId,
            PersonnelId = entity.PersonnelId,
            Public = entity.Public
        };
    }

    public async Task<ToDoDto?> UpdateAsync(int id, CreateToDoDto dto, int? personnelId = null)
    {
        var entity = await _db.ToDos.FirstOrDefaultAsync(t => t.ToDoId == id);
        if (entity == null)
            return null;

        // Authorization: Only the creator (PersonnelId owner) can update the todo
        if (personnelId.HasValue && entity.PersonnelId != personnelId.Value)
            return null;

        var wasFinished = entity.Finished;
        entity.ToDoText = dto.ToDoText.Trim();
        entity.PersonnelId = dto.PersonnelId;
        entity.Public = dto.Public;
        entity.Finished = dto.Finished;

        // Set FinishedAt and FinishedBy when transitioning from not finished to finished
        if (!wasFinished && dto.Finished)
        {
            entity.FinishedAt = DateTime.UtcNow;
            entity.FinishedBy = personnelId;
        }
        // Clear FinishedAt and FinishedBy if marking as unfinished again
        else if (wasFinished && !dto.Finished)
        {
            entity.FinishedAt = null;
            entity.FinishedBy = null;
        }

        _db.ToDos.Update(entity);
        await _db.SaveChangesAsync();

        return new ToDoDto
        {
            ToDoId = entity.ToDoId,
            Finished = entity.Finished,
            FinishedAt = entity.FinishedAt,
            FinishedBy = entity.FinishedBy,
            ToDoText = entity.ToDoText,
            PatientId = entity.PatientId,
            PersonnelId = entity.PersonnelId,
            Public = entity.Public
        };
    }

    public async Task<bool> DeleteAsync(int id, int? personnelId = null)
    {
        var entity = await _db.ToDos.FirstOrDefaultAsync(t => t.ToDoId == id);
        if (entity == null)
            return false;

        // Authorization: Only the creator (PersonnelId) can delete the todo
        // This prevents unauthorized deletion of shared/public todos
        if (personnelId.HasValue && entity.PersonnelId != personnelId.Value)
            return false;

        _db.ToDos.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }
}
