using backend.src.Domain.Models;

namespace backend.src.Application.ToDos.Interfaces;

public interface IToDoRuleService
{
    /// <summary>
    /// Evaluates if a response matches any ToDoRules and creates TODOs accordingly.
    /// </summary>
    Task ProcessResponseAsync(Response response);
    
    /// <summary>
    /// Evaluates if a response matches any ToDoRules with a pre-calculated category score.
    /// </summary>
    Task ProcessResponseWithScoreAsync(Response response, int? categoryScore);
    
    /// <summary>
    /// Processes all CategoryScoreRules for a specific category once per batch.
    /// Creates a single ToDo if any rule matches (not one per response).
    /// </summary>
    Task ProcessCategoryRulesAsync(int patientId, int categoryId, int categoryScore);
    
    /// <summary>
    /// Evaluates if a response matches a specific ToDoRule, with optional pre-calculated category score.
    /// </summary>
    Task<bool> MatchesRuleAsync(Response response, ToDoRule rule, int? categoryScore = null);
    
    /// <summary>
    /// Creates a ToDo from a matching ToDoRule with deduplication logic.
    /// Checks if an unfinished ToDo already exists for this rule and patient.
    /// </summary>
    Task CreateToDoFromRuleAsync(int patientId, ToDoRule rule);
}
