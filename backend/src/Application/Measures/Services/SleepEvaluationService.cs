using backend.src.Domain.Models;

namespace backend.src.Application.Measures.Services;

/// <summary>
/// Implements the clinical sleep scoring flowchart.
/// Returns the Title identifier(s) of PatientMeasures that should be shown to the patient.
///
/// Groups:
///   Nattlig søvnvanske : Q124–127  (sum >= 2 = flagged)
///   Dagtidskonsekvens  : Q128–131  (sum >= 2 = flagged)
///   Hyppighet          : Q132      (score == 2, >= 3 dager = flagged)
///   Varighet           : Q133      (score >= 1, >= 1 mnd = ICD-10 criteria met)
///   Differensialdiagn. : Q134–139  (any score >= 1 = flagged)
///
/// Patient tiltak titles:
///   "sleep_good"        – ingen flagg
///   "sleep_mild"        – kun differensialdiagnose-flagg
///   "sleep_significant" – nattlig + dagtid flagget (subterskel eller full insomni)
/// </summary>
public class SleepEvaluationService
{
    private static readonly int[] NattligIds = { 124, 125, 126, 127 };
    private static readonly int[] DagtidIds = { 128, 129, 130, 131 };
    private static readonly int HyppighetId = 132;
    private static readonly int VarighetId = 133;
    private static readonly int[] DifferensialIds = { 134, 135, 136, 137, 138, 139 };

    private static readonly HashSet<int> AllSleepIds = new(
        NattligIds
            .Concat(DagtidIds)
            .Append(HyppighetId)
            .Append(VarighetId)
            .Concat(DifferensialIds));

    /// <summary>
    /// Returns the Title value(s) to activate in PatientMeasures based on the patient's responses.
    /// The caller should fetch all PatientMeasures WHERE Title IN (returned values)
    /// AND TriggerType = Custom.
    /// </summary>
    public IReadOnlyList<string> EvaluatePatientTitles(
        IEnumerable<Question> questions,
        IReadOnlyDictionary<int, Response> responses)
    {
        var questionMap = questions
            .Where(q => AllSleepIds.Contains(q.QuestionId))
            .ToDictionary(q => q.QuestionId);

        int nattligScore = NattligIds.Sum(id => GetScore(questionMap, responses, id));
        int dagtidScore = DagtidIds.Sum(id => GetScore(questionMap, responses, id));
        bool hasDifferensial = DifferensialIds.Any(id => GetScore(questionMap, responses, id) >= 1);

        bool nattligFlag = nattligScore >= 2;
        bool dagtidFlag = dagtidScore >= 2;
        bool insomniFlag = nattligFlag && dagtidFlag; // utslag på spm 1-10

        // Høy: utslag på både spm 1-10 og differensialdiagnose
        if (insomniFlag && hasDifferensial)
            return ["Betydelige søvnvansker"];

        // Middels: utslag på enten spm 1-10 eller differensialdiagnose
        if (insomniFlag || hasDifferensial)
            return ["Noen søvnproblemer"];

        // Lav: ingen flagg
        return ["God søvn"];
    }

    /// <summary>
    /// Returns the severity score for a question based on the patient's selected option.
    /// Uses the Severity rules already loaded on the Question entity.
    /// </summary>
    private static int GetScore(
        IReadOnlyDictionary<int, Question> questionMap,
        IReadOnlyDictionary<int, Response> responses,
        int questionId)
    {
        if (!questionMap.TryGetValue(questionId, out var question))
            return 0;

        if (!responses.TryGetValue(questionId, out var response) || response?.SelectedOptionId == null)
            return 0;

        foreach (var severity in question.Severities)
        {
            if (severity.RequiredOption.HasValue && response.SelectedOptionId == severity.RequiredOption.Value)
                return severity.Score;
        }

        return 0;
    }
}
