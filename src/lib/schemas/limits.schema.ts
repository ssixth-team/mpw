export interface MPW_LIMITS {
  code: string;
  name: string;
  minValue: number;
  maxValue: number;
  avail: 'Y' | 'N';
}

export const limitsSchema = 'code';
