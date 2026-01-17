export interface Reference {
  id: number;
  process: 'design' | 'development' | 'testing' | 'deployment';
  rev: 'A' | 'B' | 'C' | 'D';
  createUser: {
    id: string;
    name: string;
    email: string;
  };
  createDate: string;
}

export const referenceSchema = '++id, process, rev, createDate';
