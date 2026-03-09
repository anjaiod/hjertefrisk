namespace backend.src.Domain.Models;

public class Patient
{
    public int Id { get; set;}
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }



    public ICollection<Response> Responses { get; set; } = new List<Response>();
    public ICollection<PatientAccess> PatientAccesses { get; set; } = new List<PatientAccess>();
    public ICollection<ToDo> ToDos { get; set; } = new List<ToDo>();
    public ICollection<MeasurementResult> MeasurementResults { get; set; } = new List<MeasurementResult>();    
}