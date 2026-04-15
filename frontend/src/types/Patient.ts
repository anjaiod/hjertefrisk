export type CreatePatientDto = {
  supabaseUserId: string;
  name: string;
  email: string;
};

export type PatientDto = {
  id: number;
  supabaseUserId: string;
  name: string;
  email: string;
  createdAt: string;
  lastVisited?: string | null;
  riskLevel?: string | null;
};

export type PatientScoreDto = {
  patientId: number;
  totalScore: number;
};

export type LatestMeasurementResultDto = {
  measurementId: number;
  result: number;
  registeredAt: string;
};
