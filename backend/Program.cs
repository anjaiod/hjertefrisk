using backend.src.Infrastructure.Data;
using backend.src.Application.Languages.Interfaces;
using backend.src.Application.Languages.Services;

using backend.src.Application.Queries.Interfaces;
using backend.src.Application.Queries.Services;

using backend.src.Application.Questions.Interfaces;
using backend.src.Application.Questions.Services;
using backend.src.Application.Categories.Interfaces;
using backend.src.Application.Categories.Services;
using backend.src.Application.QuestionOptions.Interfaces;
using backend.src.Application.QuestionOptions.Services;
using backend.src.Application.Measures.Interfaces;
using backend.src.Application.Measures.Services;
using backend.src.Application.Severities.Interfaces;
using backend.src.Application.Severities.Services;
using backend.src.Application.Measurements.Interfaces;
using backend.src.Application.Measurements.Services;
using backend.src.Application.Patients.Interfaces;
using backend.src.Application.Patients.Services;
using backend.src.Application.ToDos.Interfaces;
using backend.src.Application.ToDos.Services;
using backend.src.Application.Responses.Interfaces;
using backend.src.Application.Responses.Services;
using backend.src.Application.Personnel.Interfaces;
using backend.src.Application.Personnel.Services;
using backend.src.Application.QuestionDependencies.Interfaces;
using backend.src.Application.QuestionDependencies.Services;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
const string CorsPolicyName = "FrontendDev";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3001", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Application services / repositories
builder.Services.AddScoped<ILanguageService, LanguageService>();

builder.Services.AddScoped<IQueryService, QueryService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IQuestionOptionService, QuestionOptionService>();
builder.Services.AddScoped<IMeasureService, MeasureService>();
builder.Services.AddScoped<ISeverityService, SeverityService>();
builder.Services.AddScoped<IMeasurementService, MeasurementService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IToDoService, ToDoService>();
builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IPersonnelService, PersonnelService>();
builder.Services.AddScoped<IQuestionDependencyService, QuestionDependencyService>();

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
app.UseCors(CorsPolicyName);

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();