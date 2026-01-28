import type { MPW_FAB_OUT_ASM_DECISION_FLOW } from '$lib/schemas/fab_out_asm_decision_flow.schema';

export interface MPW_FAB_OUT_ASM_DECISION {
  id: number;
  fabOutAsmExecId: number;
  fabOutModuleId: number;
  asmLogId: string;
  asmQuantity: string;
  task: [MPW_FAB_OUT_ASM_DECISION_FLOW];


}

export const fabOutAsmDecisionSchema = '++id';
