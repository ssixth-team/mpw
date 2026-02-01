import { type Account } from './account.schema';

export interface MPW_REF_FILE {
  id: number;
  createUser: Account;
  createDate: string;
  fileOrgName: string;
  fileServerPath: string;
  avail: 'Y' | 'N';
  deleteUser: Account;
  deleteDate: string;
}

export const refFileSchema = '++id, &fileServerPath';
