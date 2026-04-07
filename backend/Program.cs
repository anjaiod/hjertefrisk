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
using backend.src.Application.MeasurementResults.Interfaces;
using backend.src.Application.MeasurementResults.Services;
using backend.src.Application.QuickMeasures.Interfaces;
using backend.src.Application.QuickMeasures.Services;

using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
const string CorsPolicyName = "FrontendDev";

// Add services to the container
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var rawConnectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.");

var connectionString = NormalizePostgresConnectionString(rawConnectionString);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        npgsqlOptions => npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

// Application services / repositories
builder.Services.AddScoped<ILanguageService, LanguageService>();

builder.Services.AddScoped<IQueryService, QueryService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IQuestionOptionService, QuestionOptionService>();
builder.Services.AddScoped<IPatientMeasureService, PatientMeasureService>();
builder.Services.AddScoped<IPersonnelMeasureService, PersonnelMeasureService>();
builder.Services.AddScoped<IMeasureEvaluationService, MeasureEvaluationService>();
builder.Services.AddScoped<ISeverityService, SeverityService>();
builder.Services.AddScoped<IMeasurementService, MeasurementService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IToDoService, ToDoService>();
builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IPersonnelService, PersonnelService>();
builder.Services.AddScoped<IQuestionDependencyService, QuestionDependencyService>();
builder.Services.AddScoped<IMeasurementResultService, MeasurementResultService>();
builder.Services.AddScoped<IQuickMeasureService, QuickMeasureService>();

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

var httpsPort = app.Configuration["ASPNETCORE_HTTPS_PORT"] ?? app.Configuration["HTTPS_PORT"];
if (!string.IsNullOrWhiteSpace(httpsPort))
{
    app.UseHttpsRedirection();
}

app.UseCors(CorsPolicyName);

app.MapControllers();

app.Run();

static string NormalizePostgresConnectionString(string input)
{
    if (string.IsNullOrWhiteSpace(input))
    {
        throw new InvalidOperationException("Connection string cannot be empty.");
    }

    if (!Uri.TryCreate(input, UriKind.Absolute, out var uri) ||
        (uri.Scheme != "postgres" && uri.Scheme != "postgresql"))
    {
        return input;
    }

    var userInfo = uri.UserInfo.Split(':', 2, StringSplitOptions.None);
    var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "";
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";

    var databaseName = uri.AbsolutePath.Trim('/');
    if (string.IsNullOrWhiteSpace(databaseName))
    {
        databaseName = "postgres";
    }

    var sslModeValue = "require";
    var query = uri.Query.TrimStart('?');
    if (!string.IsNullOrWhiteSpace(query))
    {
        foreach (var pair in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var keyValue = pair.Split('=', 2, StringSplitOptions.None);
            var key = keyValue[0];

            if (key.Equals("sslmode", StringComparison.OrdinalIgnoreCase))
            {
                sslModeValue = keyValue.Length > 1 && !string.IsNullOrWhiteSpace(keyValue[1])
                    ? Uri.UnescapeDataString(keyValue[1])
                    : "require";
                break;
            }
        }
    }

    if (!Enum.TryParse<SslMode>(sslModeValue, ignoreCase: true, out var sslMode))
    {
        sslMode = SslMode.Require;
    }

    var builder = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.IsDefaultPort ? 5432 : uri.Port,
        Database = databaseName,
        Username = username,
        Password = password,
        SslMode = sslMode
    };

    return builder.ConnectionString;
}