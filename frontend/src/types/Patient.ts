export type CreatePatientDto = {
  name: string;
  email: string;
};

export type PatientDto = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type PatientScoreDto = {
  patientId: number;
  totalScore: number;
};
