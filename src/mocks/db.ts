import Dexie, { type EntityTable } from 'dexie';
import { type Item, itemSchema } from './schemas/item.schema';
import { type Reference, referenceSchema } from './schemas/reference.schema';
import { type Code, codeSchema } from './schemas/code.schema';
import type { MPW_BUMP } from '$lib/schemas/bump.schema';
import type { MPW_CORNER } from '$lib/schemas/corner.schema';
import type { MPW_STATUS } from '$lib/schemas/status.schema';
import type { MPW_LIMITS } from '$lib/schemas/limits.schema';

// Re-export types for convenience
export type { Item, Reference, Code, MPW_BUMP, MPW_CORNER, MPW_STATUS, MPW_LIMITS };

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  references!: EntityTable<Reference, 'id'>;
  codes!: EntityTable<Code, 'id'>;
  bumps!: EntityTable<MPW_BUMP, 'code'>;
  corners!: EntityTable<MPW_CORNER, 'code'>;
  statuses!: EntityTable<MPW_STATUS, 'code'>;
  limits!: EntityTable<MPW_LIMITS, 'code'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: itemSchema
    });
    this.version(2).stores({
      items: itemSchema,
      references: referenceSchema
    });
    // type 필드 추가를 위한 버전 업그레이드
    this.version(3).stores({
      items: itemSchema,
      references: referenceSchema
    });
    this.version(4).stores({
      items: itemSchema,
      references: referenceSchema,
      codes: codeSchema
    });
    // Common Code 테이블 추가
    this.version(5).stores({
      items: itemSchema,
      references: referenceSchema,
      codes: codeSchema,
      bumps: 'code, name, useTag, avail',
      corners: 'code, name, avail',
      statuses: 'code, name, avail',
      limits: 'code, name, minValue, maxValue, avail'
    });

    this.on('populate', () => {
      this.codes.bulkAdd([
        { group: 'PROCESS', code: 'DESIGN', name: 'Design', sortOrder: 1 },
        { group: 'PROCESS', code: 'DEVELOPMENT', name: 'Development', sortOrder: 2 },
        { group: 'PROCESS', code: 'TESTING', name: 'Testing', sortOrder: 3 },
        { group: 'PROCESS', code: 'DEPLOYMENT', name: 'Deployment', sortOrder: 4 },
        { group: 'AVAIL', code: 'Y', name: 'Yes', sortOrder: 1 },
        { group: 'AVAIL', code: 'N', name: 'No', sortOrder: 2 }
      ]);

      // Common Code 초기 데이터
      this.bumps.bulkAdd([
        { code: 'BUMP001', name: 'Standard Bump', useTag: 'Y', avail: 'Y' },
        { code: 'BUMP002', name: 'Advanced Bump', useTag: 'Y', avail: 'Y' },
        { code: 'BUMP003', name: 'Legacy Bump', useTag: 'N', avail: 'N' }
      ]);

      this.corners.bulkAdd([
        { code: 'CORNER001', name: 'Top Left', avail: 'Y' },
        { code: 'CORNER002', name: 'Top Right', avail: 'Y' },
        { code: 'CORNER003', name: 'Bottom Left', avail: 'Y' },
        { code: 'CORNER004', name: 'Bottom Right', avail: 'Y' }
      ]);

      this.statuses.bulkAdd([
        { code: 'STATUS001', name: 'Active', avail: 'Y' },
        { code: 'STATUS002', name: 'Inactive', avail: 'Y' },
        { code: 'STATUS003', name: 'Pending', avail: 'Y' },
        { code: 'STATUS004', name: 'Archived', avail: 'N' }
      ]);

      this.limits.bulkAdd([
        { code: 'LIMIT001', name: 'Temperature', minValue: 0, maxValue: 100, avail: 'Y' },
        { code: 'LIMIT002', name: 'Pressure', minValue: 0, maxValue: 200, avail: 'Y' },
        { code: 'LIMIT003', name: 'Voltage', minValue: 0, maxValue: 50, avail: 'Y' }
      ]);
    });
  }
}

export const db = new AppDB();
