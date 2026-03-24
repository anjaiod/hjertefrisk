using backend.src.Application.MeasurementResults.DTOs;

namespace backend.src.Application.MeasurementResults.Interfaces;

public interface IMeasurementResultService
{
    Task<IEnumerable<MeasurementResultDto>> UpsertManyAsync(IEnumerable<CreateMeasurementResultDto> dtos);
    Task<IEnumerable<MeasurementResultDto>> GetLatestForPatientAsync(int patientId);
}
