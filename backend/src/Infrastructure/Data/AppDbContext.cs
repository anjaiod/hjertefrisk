using backend.src.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Language> Language => Set<Language>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Personnel> Personnel => Set<Personnel>();
    public DbSet<Query> Queries => Set<Query>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionText> QuestionTexts => Set<QuestionText>();
    public DbSet<QueryQuestion> QueryQuestions => Set<QueryQuestion>();
    public DbSet<QuestionOption> QuestionOptions => Set<QuestionOption>();
    public DbSet<OptionText> OptionTexts => Set<OptionText>();
    public DbSet<Response> Responses => Set<Response>();
    public DbSet<AnsweredQuery> AnsweredQueries => Set<AnsweredQuery>();
    public DbSet<QuestionDependency> QuestionDependencies => Set<QuestionDependency>();
    public DbSet<PatientAccess> PatientAccesses => Set<PatientAccess>();
    public DbSet<ToDo> ToDos => Set<ToDo>();
    public DbSet<PatientMeasure> PatientMeasures => Set<PatientMeasure>();
    public DbSet<PersonnelMeasure> PersonnelMeasures => Set<PersonnelMeasure>();
    public DbSet<Severity> Severities => Set<Severity>();
    public DbSet<PatientMeasureText> PatientMeasureTexts => Set<PatientMeasureText>();
    public DbSet<PersonnelMeasureText> PersonnelMeasureTexts => Set<PersonnelMeasureText>();
    public DbSet<Measurement> Measurements => Set<Measurement>();
    public DbSet<MeasurementText> MeasurementTexts => Set<MeasurementText>();
    public DbSet<MeasurementResult> MeasurementResults => Set<MeasurementResult>();
    public DbSet<PatientMeasureResult> PatientMeasureResults => Set<PatientMeasureResult>();
    public DbSet<PersonnelMeasureResult> PersonnelMeasureResults => Set<PersonnelMeasureResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // -------------------------
        // KEYS
        // -------------------------
        modelBuilder.Entity<Language>().HasKey(x => x.Code);
        modelBuilder.Entity<Category>().HasKey(x => x.CategoryId);

        modelBuilder.Entity<QuestionText>().HasKey(x => new { x.QuestionId, x.LanguageCode });
        modelBuilder.Entity<OptionText>().HasKey(x => new { x.QuestionOptionId, x.LanguageCode });
        modelBuilder.Entity<PatientMeasureText>().HasKey(x => new { x.PatientMeasureId, x.LanguageCode });
        modelBuilder.Entity<PersonnelMeasureText>().HasKey(x => new { x.PersonnelMeasureId, x.LanguageCode });
        modelBuilder.Entity<MeasurementText>().HasKey(x => new { x.MeasurementId, x.LanguageCode });

        modelBuilder.Entity<QueryQuestion>().HasKey(x => new { x.QueryId, x.QuestionId });
        modelBuilder.Entity<Response>().HasKey(x => new { x.AnsweredQueryId, x.PatientId, x.QuestionId });
        modelBuilder.Entity<PatientAccess>().HasKey(x => new { x.PatientId, x.PersonnelId });
        modelBuilder.Entity<MeasurementResult>().HasKey(x => new { x.MeasurementId, x.PatientId, x.RegisteredAt });

        modelBuilder.Entity<QuestionDependency>().HasKey(x => x.Id);

        modelBuilder.Entity<QuestionDependency>()
            .HasIndex(x => new
            {
                x.ParentQueryId,
                x.ParentQuestionId,
                x.ChildQueryId,
                x.ChildQuestionId,
                x.TriggerOptionId
            })
            .IsUnique();

        // -------------------------
        // UNIQUE INDEXES
        // -------------------------
        modelBuilder.Entity<Patient>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Patient>()
            .HasIndex(x => x.SupabaseUserId)
            .IsUnique();

        modelBuilder.Entity<Personnel>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Personnel>()
            .HasIndex(x => x.SupabaseUserId)
            .IsUnique();

        modelBuilder.Entity<Category>()
            .HasIndex(x => x.Name)
            .IsUnique();

        // -------------------------
        // COLUMN TYPES (Postgres)
        // -------------------------
        modelBuilder.Entity<Question>().Property(x => x.FallbackText).HasColumnType("text");
        modelBuilder.Entity<QuestionOption>().Property(x => x.FallbackText).HasColumnType("text");
        modelBuilder.Entity<Response>().Property(x => x.TextValue).HasColumnType("text");
        modelBuilder.Entity<QuestionDependency>().Property(x => x.TriggerTextValue).HasColumnType("text");
        modelBuilder.Entity<QuestionText>().Property(x => x.Text).HasColumnType("text");

        // If you want these as text too:
        modelBuilder.Entity<PatientMeasure>().Property(x => x.FallbackText).HasColumnType("text");
        modelBuilder.Entity<PatientMeasure>().Property(x => x.Title).HasColumnType("text");
        modelBuilder.Entity<PersonnelMeasure>().Property(x => x.FallbackText).HasColumnType("text");
        modelBuilder.Entity<PersonnelMeasure>().Property(x => x.Title).HasColumnType("text");
        modelBuilder.Entity<Measurement>().Property(x => x.FallbackText).HasColumnType("text");
        modelBuilder.Entity<PatientMeasureText>().Property(x => x.Title).HasColumnType("text");
        modelBuilder.Entity<PersonnelMeasureText>().Property(x => x.Title).HasColumnType("text");

        // -------------------------
        // DEFAULTS
        // -------------------------
        modelBuilder.Entity<Patient>()
            .Property(x => x.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<Personnel>()
            .Property(x => x.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<Response>()
            .Property(x => x.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<AnsweredQuery>()
            .Property(x => x.CreatedAt)
            .HasDefaultValueSql("NOW()");

        // -------------------------
        // RELATIONSHIPS
        // -------------------------

        // QuestionText
        modelBuilder.Entity<QuestionText>()
            .HasOne(x => x.Question)
            .WithMany(q => q.Texts)
            .HasForeignKey(x => x.QuestionId);

        modelBuilder.Entity<QuestionText>()
            .HasOne(x => x.Language)
            .WithMany(l => l.QuestionTexts)
            .HasForeignKey(x => x.LanguageCode);

        // OptionText
        modelBuilder.Entity<OptionText>()
            .HasOne(x => x.Option)
            .WithMany(o => o.Texts)
            .HasForeignKey(x => x.QuestionOptionId);

        modelBuilder.Entity<OptionText>()
            .HasOne(x => x.Language)
            .WithMany(l => l.OptionTexts)
            .HasForeignKey(x => x.LanguageCode);

        // QueryQuestion
        modelBuilder.Entity<QueryQuestion>()
            .HasOne(x => x.Query)
            .WithMany(q => q.QueryQuestions)
            .HasForeignKey(x => x.QueryId);

        modelBuilder.Entity<QueryQuestion>()
            .HasOne(x => x.Question)
            .WithMany(q => q.QueryQuestions)
            .HasForeignKey(x => x.QuestionId);

        // QuestionOption
        modelBuilder.Entity<QuestionOption>()
            .HasOne(x => x.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(x => x.QuestionId);

        // AnsweredQuery
        modelBuilder.Entity<AnsweredQuery>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.AnsweredQueries)
            .HasForeignKey(x => x.PatientId);

        // Response
        modelBuilder.Entity<Response>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.Responses)
            .HasForeignKey(x => x.PatientId);

        modelBuilder.Entity<Response>()
            .HasOne(x => x.AnsweredQuery)
            .WithMany(aq => aq.Responses)
            .HasForeignKey(x => x.AnsweredQueryId);

        // Category
        modelBuilder.Entity<Question>()
            .HasOne(x => x.Category)
            .WithMany(c => c.Questions)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Measurement>()
            .HasOne(x => x.Category)
            .WithMany(c => c.Measurements)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Response>()
            .HasOne(x => x.Question)
            .WithMany(q => q.Responses)
            .HasForeignKey(x => x.QuestionId);

        modelBuilder.Entity<Response>()
            .HasOne(x => x.SelectedOption)
            .WithMany()
            .HasForeignKey(x => x.SelectedOptionId)
            .OnDelete(DeleteBehavior.Restrict);

        // QuestionDependency (multiple FKs to same tables)
        modelBuilder.Entity<QuestionDependency>()
            .HasOne(x => x.ParentQuery)
            .WithMany(q => q.ParentDependencies)
            .HasForeignKey(x => x.ParentQueryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuestionDependency>()
            .HasOne(x => x.ChildQuery)
            .WithMany(q => q.ChildDependencies)
            .HasForeignKey(x => x.ChildQueryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuestionDependency>()
            .HasOne(x => x.ParentQuestion)
            .WithMany(q => q.ParentDependencies)
            .HasForeignKey(x => x.ParentQuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuestionDependency>()
            .HasOne(x => x.ChildQuestion)
            .WithMany(q => q.ChildDependencies)
            .HasForeignKey(x => x.ChildQuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<QuestionDependency>()
            .HasOne(x => x.TriggerOption)
            .WithMany()
            .HasForeignKey(x => x.TriggerOptionId)
            .OnDelete(DeleteBehavior.Restrict);

        // PatientAccess
        modelBuilder.Entity<PatientAccess>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.PatientAccesses)
            .HasForeignKey(x => x.PatientId);

        modelBuilder.Entity<PatientAccess>()
            .HasOne(x => x.Personnel)
            .WithMany(p => p.PatientAccesses)
            .HasForeignKey(x => x.PersonnelId);

        // ToDo
        modelBuilder.Entity<ToDo>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.ToDos)
            .HasForeignKey(x => x.PatientId);

        modelBuilder.Entity<ToDo>()
            .HasOne(x => x.Personnel)
            .WithMany(p => p.ToDos)
            .HasForeignKey(x => x.PersonnelId);

        // Question -> Measurement (optional)
        modelBuilder.Entity<Question>()
            .HasOne(x => x.Measurement)
            .WithMany()
            .HasForeignKey(x => x.MeasurementId)
            .OnDelete(DeleteBehavior.SetNull);

        // PatientMeasure + PatientMeasureText
        modelBuilder.Entity<PatientMeasure>()
            .Property(x => x.TriggerType)
            .HasConversion<string>();

        modelBuilder.Entity<PatientMeasure>()
            .HasOne(x => x.Question)
            .WithMany(q => q.PatientMeasures)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PatientMeasure>()
            .HasOne(x => x.Category)
            .WithMany(c => c.PatientMeasures)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PatientMeasure>()
            .HasOne(x => x.RequiredOptionNavigation)
            .WithMany()
            .HasForeignKey(x => x.RequiredOption)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PatientMeasureText>()
            .HasOne(x => x.Measure)
            .WithMany(m => m.Texts)
            .HasForeignKey(x => x.PatientMeasureId);

        modelBuilder.Entity<PatientMeasureText>()
            .HasOne(x => x.Language)
            .WithMany(l => l.PatientMeasureTexts)
            .HasForeignKey(x => x.LanguageCode);

        // PersonnelMeasure + PersonnelMeasureText
        modelBuilder.Entity<PersonnelMeasure>()
            .Property(x => x.TriggerType)
            .HasConversion<string>();

        modelBuilder.Entity<PersonnelMeasure>()
            .HasOne(x => x.Question)
            .WithMany(q => q.PersonnelMeasures)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PersonnelMeasure>()
            .HasOne(x => x.Category)
            .WithMany(c => c.PersonnelMeasures)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PersonnelMeasure>()
            .HasOne(x => x.RequiredOptionNavigation)
            .WithMany()
            .HasForeignKey(x => x.RequiredOption)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PersonnelMeasureText>()
            .HasOne(x => x.Measure)
            .WithMany(m => m.Texts)
            .HasForeignKey(x => x.PersonnelMeasureId);

        modelBuilder.Entity<PersonnelMeasureText>()
            .HasOne(x => x.Language)
            .WithMany(l => l.PersonnelMeasureTexts)
            .HasForeignKey(x => x.LanguageCode);

        // Severity
        modelBuilder.Entity<Severity>()
            .HasCheckConstraint("CK_Severity_QuestionOrMeasurement", "(\"QuestionId\" IS NOT NULL AND \"MeasurementId\" IS NULL) OR (\"QuestionId\" IS NULL AND \"MeasurementId\" IS NOT NULL)");

        modelBuilder.Entity<Severity>()
            .HasOne(x => x.Question)
            .WithMany(q => q.Severities)
            .HasForeignKey(x => x.QuestionId);

        modelBuilder.Entity<Severity>()
            .HasOne(x => x.Measurement)
            .WithMany(m => m.Severities)
            .HasForeignKey(x => x.MeasurementId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Severity>()
            .HasOne(x => x.RequiredOptionNavigation)
            .WithMany()
            .HasForeignKey(x => x.RequiredOption)
            .OnDelete(DeleteBehavior.Restrict);

        // Measurement + MeasurementText + MeasurementResult
        modelBuilder.Entity<MeasurementText>()
            .HasOne(x => x.Measurement)
            .WithMany(t => t.Texts)
            .HasForeignKey(x => x.MeasurementId);

        modelBuilder.Entity<MeasurementText>()
            .HasOne(x => x.Language)
            .WithMany(l => l.MeasurementTexts)
            .HasForeignKey(x => x.LanguageCode);

        modelBuilder.Entity<MeasurementResult>()
            .HasOne(x => x.Measurement)
            .WithMany(t => t.Results)
            .HasForeignKey(x => x.MeasurementId);

        modelBuilder.Entity<MeasurementResult>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.MeasurementResults)
            .HasForeignKey(x => x.PatientId);

        modelBuilder.Entity<MeasurementResult>()
            .HasOne(x => x.RegisteredByPersonnel)
            .WithMany(p => p.RegisteredMeasurementResults)
            .HasForeignKey(x => x.RegisteredBy)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        // Measure results
        modelBuilder.Entity<PatientMeasureResult>()
            .Property(x => x.Source)
            .HasConversion<string>();

        modelBuilder.Entity<PatientMeasureResult>()
            .HasOne(x => x.Measure)
            .WithMany()
            .HasForeignKey(x => x.PatientMeasureId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PatientMeasureResult>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.PatientMeasureResults)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PatientMeasureResult>()
            .HasOne(x => x.Query)
            .WithMany()
            .HasForeignKey(x => x.QueryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PatientMeasureResult>()
            .HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PatientMeasureResult>()
            .HasOne(x => x.TriggerQuestion)
            .WithMany()
            .HasForeignKey(x => x.TriggerQuestionId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .Property(x => x.Source)
            .HasConversion<string>();

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.Measure)
            .WithMany()
            .HasForeignKey(x => x.PersonnelMeasureId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.Patient)
            .WithMany(p => p.PersonnelMeasureResults)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.Personnel)
            .WithMany(p => p.PersonnelMeasureResults)
            .HasForeignKey(x => x.PersonnelId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.Query)
            .WithMany()
            .HasForeignKey(x => x.QueryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PersonnelMeasureResult>()
            .HasOne(x => x.TriggerQuestion)
            .WithMany()
            .HasForeignKey(x => x.TriggerQuestionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
