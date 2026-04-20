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
using backend.src.Application.Authorization.Interfaces;
using backend.src.Application.Authorization.Services;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
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

// Configure JwtBearer authentication for Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"];
var supabaseAnonKey = builder.Configuration["Supabase:AnonKey"];

if (!string.IsNullOrWhiteSpace(supabaseUrl) && !string.IsNullOrWhiteSpace(supabaseAnonKey))
{
    // Clean up URL (remove trailing slash if present)
    supabaseUrl = supabaseUrl.TrimEnd('/');

    // Supabase auth URL for JWKS endpoint
    var supabaseAuthUrl = $"{supabaseUrl}/auth/v1";

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = supabaseAuthUrl;
            options.Audience = "authenticated";
            // CRITICAL: Disable claim type mapping to preserve 'sub' and other claims as-is
            options.MapInboundClaims = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = supabaseAuthUrl,
                ValidateAudience = true,
                ValidAudience = "authenticated",
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            };
        });
}

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
builder.Services.AddScoped<IToDoRuleService, ToDoRuleService>();
builder.Services.AddScoped<IToDoRuleManagementService, ToDoRuleManagementService>();
builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IPersonnelService, PersonnelService>();
builder.Services.AddScoped<IQuestionDependencyService, QuestionDependencyService>();
builder.Services.AddScoped<IMeasurementResultService, MeasurementResultService>();
builder.Services.AddScoped<IAccessAuthorizationService, AccessAuthorizationService>();
builder.Services.AddScoped<IQuickMeasureService, QuickMeasureService>();

// Optional but recommended for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply pending migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
        Console.WriteLine("[Startup] Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Startup] Error applying migrations: {ex.Message}");
        throw;
    }
}

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


if (!string.IsNullOrWhiteSpace(builder.Configuration["Supabase:Url"]) &&
    !string.IsNullOrWhiteSpace(builder.Configuration["Supabase:AnonKey"]))
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

app.Run();

static string NormalizePostgresConnectionString(string input)
{
    if (string.IsNullOrWhiteSpace(input))
    {
        throw new InvalidOperationException("Connection string cannot be empty.");
    }

    NpgsqlConnectionStringBuilder builder;

    if (Uri.TryCreate(input, UriKind.Absolute, out var uri) &&
        (uri.Scheme == "postgres" || uri.Scheme == "postgresql"))
    {
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

        builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = databaseName,
            Username = username,
            Password = password,
            SslMode = sslMode,
        };
    }
    else
    {
        builder = new NpgsqlConnectionStringBuilder(input);
    }

    // Limit pool size to avoid exceeding Supabase's max client connections.
    builder.MaxPoolSize = 10;
    builder.MinPoolSize = 0;
    builder.ConnectionIdleLifetime = 60;

    return builder.ConnectionString;
}