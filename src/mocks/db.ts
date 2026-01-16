import Dexie, { type EntityTable } from 'dexie';

export interface Item {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: '++id, title, createdAt'
    });
  }
}

export const db = new AppDB();
