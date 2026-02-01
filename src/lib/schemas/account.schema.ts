export interface Account {
  id: number | null;
  username: string | null;
  email: string | null;
  password: string | null;
  createDate: Date | null;
  updateDate: Date | null;
  latestLoginDate: Date | null;
  deptName: string | null;
  deptId: string | null;
  loginId: string | null;
}

export const accountSchema = '++id, loginId, email';
