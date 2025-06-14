class Product {
  id: string;
  name: string;
  unit_value: number;
  cycle_days: number;

  constructor(id: string, name: string, unit_value: number, cycle_days: number) {
    this.id = id;
    this.name = name;
    this.unit_value = unit_value;
    this.cycle_days = cycle_days;
  };
};

export default Product;