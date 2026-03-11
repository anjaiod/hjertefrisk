using backend.src.Application.Measurements.DTOs;

namespace backend.src.Application.Measurements.Interfaces;

public interface IMeasurementService
{
    Task<IEnumerable<MeasurementDto>> GetAllAsync();
    Task<MeasurementDto> CreateAsync(CreateMeasurementDto dto);
}
