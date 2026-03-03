namespace Api.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Patient" or "Personnel"
}