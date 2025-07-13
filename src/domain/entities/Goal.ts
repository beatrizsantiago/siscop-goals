import Farm from './Farm';
import Product from './Product';

type Item = {
  product: Product,
  amount: number,
};

class Goal {
  id: string;
  kind: string;
  farm: Farm;
  items: Item[];
  finished: boolean;
  created_at: Date;

  constructor(id: string, kind: string, farm: Farm, items: Item[], finished: boolean, created_at: Date) {
    this.id = id;
    this.kind = kind;
    this.farm = farm;
    this.items = items;
    this.finished = finished;
    this.created_at = created_at;
  }
};

export default Goal;
