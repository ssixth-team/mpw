import { type Account } from './account.schema';
import { type MPW_REF_FILE } from './reference_file.schema';

export interface MPW_REF {
  id: number;
  process: string;
  phase: string;
  type: 'local' | 'official';
  avail: 'Y' | 'N';
  files: [MPW_REF_FILE];
  createUser: Account;
  createDate: string;
}

export const refSchema = '++id, &[process+phase], type, avail, createDate';
