export interface MPW_ASM_RESULT_STATUS {
  code: string;
  name: string;
  sort: number;
  avail: 'Y' | 'N';
}

export const acmResultStatusSchema = 'code';
