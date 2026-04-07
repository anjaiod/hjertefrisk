using System.IdentityModel.Tokens.Jwt;

namespace backend.src.Infrastructure.Auth;

public static class AuthExtensions
{
    /// <summary>
    /// Extracts the Supabase user ID from the JWT token in the Authorization header.
    /// 
    /// SECURITY WARNING: This method only parses the JWT without validating signature, issuer, 
    /// audience, or expiry. This allows trivial token forgery and defeats authorization checks.
    /// 
    /// TODO: Wire up ASP.NET Core JwtBearer authentication middleware with Supabase JWKS validation:
    /// 1. Add AddAuthentication().AddJwtBearer() in Program.cs with TokenValidationParameters 
    ///    pointing to your Supabase instance's JWKS endpoint
    /// 2. Add [Authorize] attributes to controllers
    /// 3. Read from HttpContext.User.FindFirst("sub")?.Value instead of this method
    /// 
    /// This will provide cryptographic verification that tokens are actually signed by Supabase.
    /// </summary>
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

