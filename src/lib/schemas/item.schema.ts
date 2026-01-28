export interface Item {
  id: number;
  title: string;
  content: string;
  createDate: string;
}

export const itemSchema = '++id, title, createDate';
