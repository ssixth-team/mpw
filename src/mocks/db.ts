import Dexie, { type EntityTable } from 'dexie';
import { type Item, itemSchema } from './schemas/item.schema';
import { type Reference, referenceSchema } from './schemas/reference.schema';

// Re-export types for convenience
export type { Item, Reference };

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  references!: EntityTable<Reference, 'id'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: itemSchema
    });
    this.version(2).stores({
      items: itemSchema,
      references: referenceSchema
    });
  }
}

export const db = new AppDB();
