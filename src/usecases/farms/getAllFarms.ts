import { FarmRepository } from '@domain/repositories/FarmRepository';


class GetAllFarmsUseCase {
  constructor(private repository: FarmRepository) {}

  async execute() {
    const list = await this.repository.getAll();
    return list;
  };
};

export default GetAllFarmsUseCase;
