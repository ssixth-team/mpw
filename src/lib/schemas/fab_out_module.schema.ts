import { type Account } from './account.schema';
import type { MPW_FAB_OUT_MODULE_WAFER } from '$lib/schemas/fab_out_module_wafer.schema';
import type { MPW_ASM_DECISION_TYPE } from '$lib/schemas/asm_decision_type.schema';

export interface MPW_FAB_OUT_MODULE {
  id: number;
  childId: number;
  wafers: [MPW_FAB_OUT_MODULE_WAFER];
  module: string;
  ipOwner: [Account];
  asmDecisionType: MPW_ASM_DECISION_TYPE;
  asmDecisionUser: Account;
  asmDecisionDate: string;
}

export const fabOutModuleSchema = '++id, &[childId+wafer+module]';
