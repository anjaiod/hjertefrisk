using backend.src.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db) => _db = db;

    [HttpGet("db")]
    public async Task<IActionResult> Db()
    {
        var canConnect = await _db.Database.CanConnectAsync();
        return canConnect
            ? Ok(new { db = "ok" })
            : StatusCode(503, new { db = "down" });
    }

    // Optional: forces an actual DB roundtrip (still no tables)
    [HttpGet("db-query")]
    public async Task<IActionResult> DbQuery()
    {
        await _db.Database.ExecuteSqlRawAsync("SELECT 1");
        return Ok(new { db = "ok" });
    }
}