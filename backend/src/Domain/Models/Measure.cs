namespace backend.src.Domain.Models;

public class Measure
{
    public int MeasureId { get; set; }             // PK
    public int QuestionId { get; set; }            // FK -> Question
    public int? RequiredOption { get; set; }       // FK -> QuestionOption
    public string? RequiredText { get; set; }      
    public decimal? RequiredValue { get; set; }    
    public string Operator { get; set; } = "";
    public string FallbackText { get; set; }     

    public Question Question { get; set; } = null!;
    public QuestionOption? RequiredOptionNavigation { get; set; }
    public ICollection<MeasureText> Texts { get; set; } = new List<MeasureText>();
}

public class MeasureText
{
    public int MeasureId { get; set; }              // PK part, FK -> Measure
    public string LanguageCode { get; set; } = "";  // PK part, FK -> Language
    public string Text { get; set; } = "";

    public Measure Measure { get; set; } = null!;
    public Language Language { get; set; } = null!;
}