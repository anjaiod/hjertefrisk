using backend.src.Application.Notifications.DTOs;

namespace backend.src.Application.Notifications.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetForPersonnelAsync(int personnelId);
    Task MarkAsReadAsync(int notificationId, int personnelId);
    Task MarkAllAsReadAsync(int personnelId);
}
