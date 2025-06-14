import Farm from '@domain/entities/Farm';

export interface FarmRepository {
  getAll(): Promise<Farm[]>;
};
