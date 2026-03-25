namespace backend.src.Domain.Models;

public class PatientMeasure
{
    public int PatientMeasureId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string? Operator { get; set; }
    public string FallbackText { get; set; } = "";

    public string? ResourceUrl { get; set; }

    public Question? Question { get; set; }
    public Category? Category { get; set; }
    public QuestionOption? RequiredOptionNavigation { get; set; }
    public ICollection<PatientMeasureText> Texts { get; set; } = new List<PatientMeasureText>();
}

public class PersonnelMeasure
{
    public int PersonnelMeasureId { get; set; }
    public int? QuestionId { get; set; }
    public int? CategoryId { get; set; }
    public int ScoreThreshold { get; set; }
    public bool IsExclusive { get; set; }
    public int Priority { get; set; }
    public MeasureTriggerType TriggerType { get; set; }
    public int? RequiredOption { get; set; }
    public string? RequiredText { get; set; }
    public decimal? RequiredValue { get; set; }
    public string? Operator { get; set; }
    public string FallbackText { get; set; } = "";

    public string? ResourceUrl { get; set; }

    public Question? Question { get; set; }
    public Category? Category { get; set; }
    public QuestionOption? RequiredOptionNavigation { get; set; }
    public ICollection<PersonnelMeasureText> Texts { get; set; } = new List<PersonnelMeasureText>();
}

public class PatientMeasureText
{
    public int PatientMeasureId { get; set; }
    public string LanguageCode { get; set; } = "";
    public string Text { get; set; } = "";

    public PatientMeasure Measure { get; set; } = null!;
    public Language Language { get; set; } = null!;
}

public class PersonnelMeasureText
{
    public int PersonnelMeasureId { get; set; }
    public string LanguageCode { get; set; } = "";
    public string Text { get; set; } = "";

    public PersonnelMeasure Measure { get; set; } = null!;
    public Language Language { get; set; } = null!;
}

public enum MeasureTriggerType
{
    Question = 0,
    Category = 1
}

public enum MeasureResultSource
{
    QuestionTrigger = 0,
    CategoryScore = 1
}
