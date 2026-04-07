using System.IdentityModel.Tokens.Jwt;

namespace backend.src.Infrastructure.Auth;

public static class AuthExtensions
{
    /// <summary>
    /// Extracts the Supabase user ID from the authenticated context.
    /// 
    /// This method attempts to read from HttpContext.User.FindFirst("sub") first (populated by JwtBearer middleware
    /// when Supabase authentication is configured). Falls back to parsing Authorization header for backward compatibility.
    /// 
    /// When Supabase:Url and Supabase:AnonKey are configured in appsettings.json, JwtBearer middleware will
    /// automatically validate tokens against the Supabase JWKS endpoint before they reach controllers.
    /// </summary>
    public static string? GetSupabaseUserIdFromContext(this HttpContext context)
    {
        // Try to get user ID from authenticated claims (set by JwtBearer middleware)
        var subClaim = context.User?.FindFirst("sub")?.Value;
        if (!string.IsNullOrWhiteSpace(subClaim))
            return subClaim.Trim();

        // Fallback: parse from Authorization header (for backward compatibility)
        var authHeader = context.Request.Headers["Authorization"].ToString();
        if (string.IsNullOrWhiteSpace(authHeader))
            return null;

        if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return null;

        var token = authHeader["Bearer ".Length..];
        
        try
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(token);

            // Extract the 'sub' claim which contains the user ID
            var userClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub");
            if (userClaim == null)
                return null;

            var userId = userClaim.Value?.Trim();
            return string.IsNullOrWhiteSpace(userId) ? null : userId;
        }
        catch
        {
            // Invalid token format
            return null;
        }
    }
}

