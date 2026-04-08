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
    /// Evaluates if a response matches a specific ToDoRule, with optional pre-calculated category score.
    /// </summary>
    Task<bool> MatchesRuleAsync(Response response, ToDoRule rule, int? categoryScore = null);
    
    /// <summary>
    /// Creates a ToDo from a matching ToDoRule.
    /// </summary>
    Task CreateToDoFromRuleAsync(Response response, ToDoRule rule);
}
