export type CreateMeasurementResultDto = {
  measurementId: number;
  patientId: number;
  result: number;
  registeredBy?: number | null;
};

export type MeasurementResultDto = {
  measurementId: number;
  patientId: number;
  result: number;
  registeredBy?: number | null;
  registeredByName?: string | null;
  registeredAt: string;
};

export type CreateMeasurementDto = {
  categoryId?: number | null;
  unit: string;
  fallbackText: string;
};

export type MeasurementDto = {
  measurementId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  unit: string;
  fallbackText: string;
};
