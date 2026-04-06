namespace backend.src.Infrastructure.Auth;

public static class AuthExtensions
{
    public static string? GetSupabaseUserIdFromContext(this HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("x-supabase-user-id", out var value))
        {
            var userId = value.ToString().Trim();
            return string.IsNullOrWhiteSpace(userId) ? null : userId;
        }
        return null;
    }
}
