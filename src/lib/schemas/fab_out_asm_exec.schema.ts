import { type Account } from './account.schema';
import type { MPW_FAB_OUT_ASM_DECISION } from '$lib/schemas/fab_out_asm_decision.schema';

export interface MPW_FAB_OUT_ASM_EXEC {
  id: number;
  fabOutId: number;
  asmPartId: string;
  asmSite: string;
  pkgType: string;
  edsPartId: string;
  asmType: string;
  asmIpOwner: [Account];
  ipName: string;
  backLapSize: string;
  createUser: Account;
  createDate: string;
  updateUser: Account;
  updateDate: string;
  decisions: [MPW_FAB_OUT_ASM_DECISION];
}

export const fabOutAsmExecSchema = '++id';
