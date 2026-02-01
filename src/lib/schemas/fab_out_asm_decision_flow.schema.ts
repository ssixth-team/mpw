import { type Account } from './account.schema';
import type { MPW_ASM_FLOW } from '$lib/schemas/asm_flow.schema';
import type { MPW_ASM_RESULT_STATUS } from '$lib/schemas/asm_result_status.schema';

export interface MPW_FAB_OUT_ASM_DECISION_FLOW {
  id: number;
  fabOutAsmDecisionId: number;
  task: MPW_ASM_FLOW;
  result: MPW_ASM_RESULT_STATUS;
  comment: string;
  updateUser: Account;
  updateDate: string;
}

export const fabOutAsmDecisionFlowSchema = '++id';
