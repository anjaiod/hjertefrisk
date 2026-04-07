using System.IdentityModel.Tokens.Jwt;

namespace backend.src.Infrastructure.Auth;

public static class AuthExtensions
{
    public static string? GetSupabaseUserIdFromContext(this HttpContext context)
    {
        // Try to get JWT from Authorization header
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
            var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub");
            if (subClaim == null)
                return null;

            var userId = subClaim.Value?.Trim();
            return string.IsNullOrWhiteSpace(userId) ? null : userId;
        }
        catch
        {
            // Invalid token format
            return null;
        }
    }
}

