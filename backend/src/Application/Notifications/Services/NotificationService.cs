using backend.src.Application.Notifications.DTOs;
using backend.src.Application.Notifications.Interfaces;
using backend.src.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Application.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _db;

    public NotificationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<NotificationDto>> GetForPersonnelAsync(int personnelId)
    {
        // Show notifications that are either unread, or were read today.
        var startOfTodayUtc = DateTime.UtcNow.Date;

        return await _db.Notifications
            .AsNoTracking()
            .Where(n => n.PersonnelId == personnelId && (
                !n.Read || n.ReadAt == null || n.ReadAt >= startOfTodayUtc
            ))
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                PatientId = n.PatientId,
                AnsweredQueryId = n.AnsweredQueryId,
                Message = n.Message,
                CreatedAt = n.CreatedAt,
                Read = n.Read,
                ReadAt = n.ReadAt
            })
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(int notificationId, int personnelId) // method for marking message as read
    {
        var n = await _db.Notifications.FirstOrDefaultAsync(x => x.Id == notificationId && x.PersonnelId == personnelId);
        if (n == null) return;

        var changed = false;
        if (!n.Read)
        {
            n.Read = true;
            changed = true;
        }

        if (n.ReadAt == null)
        {
            n.ReadAt = DateTime.UtcNow;
            changed = true;
        }

        if (changed)
        {
            await _db.SaveChangesAsync();
        }
    }
}
