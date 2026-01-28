export interface MPW_STATUS {
  code: string;
  name: string;
  avail: 'Y' | 'N';
}

export const statusSchema = 'code';
