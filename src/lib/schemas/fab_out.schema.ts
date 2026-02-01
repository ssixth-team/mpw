import { type Account } from './account.schema';
import { type MPW_BUMP } from '$lib/schemas/bump.schema';
import { type MPW_REF } from '$lib/schemas/reference.schema';
import type { MPW_FAB_OUT_MOTHER_LOT } from '$lib/schemas/fab_out_mother_lot.schema';
import type { MPW_FAB_OUT_ASM_EXEC } from '$lib/schemas/fab_out_asm_exec.schema';

export interface MPW_FAB_OUT {
  id: number;
  type: 'local' | 'official';
  process: string;
  phase: string;
  ref: MPW_REF;
  beol: string;
  bump: MPW_BUMP;
  bumpTag: string;
  fabPartId: string;
  avail: 'Y' | 'N';
  createUser: Account;
  createDate: string;
  updateUser: Account;
  updateDate: string;
  motherLots: [MPW_FAB_OUT_MOTHER_LOT];
  status: 'Submitted' | 'Completed';
  asmExec: MPW_FAB_OUT_ASM_EXEC;
}

export const fabOutSchema = '++id, &[process+phase], type, avail, createDate';
