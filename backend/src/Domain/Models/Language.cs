namespace backend.src.Domain.Models;

public class Language
{
    public string Code { get; set; } = "";   // PK
    public string Name { get; set; } = "";

    public ICollection<QuestionText> QuestionTexts { get; set; } = new List<QuestionText>();
    public ICollection<OptionText> OptionTexts { get; set; } = new List<OptionText>();
    public ICollection<MeasureText> MeasureTexts { get; set; } = new List<MeasureText>();
    public ICollection<MeasurementText> MeasurementTexts { get; set; } = new List<MeasurementText>();
}