export interface MPW_ASM_DECISION_TYPE {
  code: string;
  name: string;
  use_auto_sub: 'Y' | 'N';
  avail: 'Y' | 'N';
}

export const acmDecisionTypeSchema = 'code';
