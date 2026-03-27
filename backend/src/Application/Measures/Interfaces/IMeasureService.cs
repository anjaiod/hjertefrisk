using backend.src.Application.Measures.DTOs;

namespace backend.src.Application.Measures.Interfaces;

public interface IPatientMeasureService
{
    Task<IEnumerable<PatientMeasureDto>> GetAllAsync();
    Task<PatientMeasureDto> CreateAsync(CreatePatientMeasureDto dto);
}

public interface IPersonnelMeasureService
{
    Task<IEnumerable<PersonnelMeasureDto>> GetAllAsync();
    Task<PersonnelMeasureDto> CreateAsync(CreatePersonnelMeasureDto dto);
}
