using backend.src.Infrastructure.Data;
using backend.src.Application.Languages.Interfaces;
using backend.src.Application.Languages.Services;

using backend.src.Application.Queries.Interfaces;
using backend.src.Application.Queries.Services;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Application services / repositories
builder.Services.AddScoped<ILanguageService, LanguageService>();

builder.Services.AddScoped<IQueryService, QueryService>();

// Optional but recommended for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();