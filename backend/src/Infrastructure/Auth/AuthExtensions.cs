using System.IdentityModel.Tokens.Jwt;

namespace backend.src.Infrastructure.Auth;

public static class AuthExtensions
{
    /// <summary>
    /// Extracts the Supabase user ID from the authenticated context.
    /// 
    /// Reads from HttpContext.User.FindFirst("sub"), which is populated by JwtBearer middleware
    /// when a valid, properly-signed token is provided. Returns null if not authenticated or
    /// if the sub claim is missing.
    /// </summary>
    public static string? GetSupabaseUserIdFromContext(this HttpContext context)
    {
        // Get user ID from authenticated claims (set by JwtBearer middleware after validation)
        var subClaim = context.User?.FindFirst("sub")?.Value;
        return string.IsNullOrWhiteSpace(subClaim) ? null : subClaim.Trim();
    }
}

