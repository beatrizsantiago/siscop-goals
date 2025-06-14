export const GOAL_KINDS:{ [key: string]: string } = {
  PRODUCTION: 'Produção',
  SALE: 'Venda',
};

export const KINDS_OPTIONS = Object.keys(GOAL_KINDS).map((key) => ({
  value: key,
  label: GOAL_KINDS[key],
}));
