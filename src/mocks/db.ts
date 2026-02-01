import Dexie, { type EntityTable } from 'dexie';
import { type Item, itemSchema } from '$lib/schemas/item.schema';
import { type MPW_REF, refSchema } from '$lib/schemas/reference.schema';
import { type Code, codeSchema } from '$lib/schemas/code.schema';
import type { MPW_BUMP } from '$lib/schemas/bump.schema';
import type { MPW_CORNER } from '$lib/schemas/corner.schema';
import type { MPW_STATUS } from '$lib/schemas/status.schema';
import type { MPW_LIMITS } from '$lib/schemas/limits.schema';
import type { MPW_ASM_TEAM } from '$lib/schemas/asm_team.schema';
import type { MPW_ASM_DECISION_TYPE } from '$lib/schemas/asm_decision_type.schema';
import type { MPW_ASM_FLOW } from '$lib/schemas/asm_flow.schema';
import type { MPW_ASM_RESULT_STATUS } from '$lib/schemas/asm_result_status.schema';

// Re-export types for convenience
export type {
  Item,
  MPW_REF,
  Code,
  MPW_BUMP,
  MPW_CORNER,
  MPW_STATUS,
  MPW_LIMITS,
  MPW_ASM_TEAM,
  MPW_ASM_DECISION_TYPE,
  MPW_ASM_FLOW,
  MPW_ASM_RESULT_STATUS
};

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  references!: EntityTable<MPW_REF, 'id'>;
  codes!: EntityTable<Code, 'id'>;
  bumps!: EntityTable<MPW_BUMP, 'code'>;
  corners!: EntityTable<MPW_CORNER, 'code'>;
  statuses!: EntityTable<MPW_STATUS, 'code'>;
  limits!: EntityTable<MPW_LIMITS, 'code'>;
  teams!: EntityTable<MPW_ASM_TEAM, 'id'>;
  decisionTypes!: EntityTable<MPW_ASM_DECISION_TYPE, 'code'>;
  taskFlows!: EntityTable<MPW_ASM_FLOW, 'code'>;
  resultStatuses!: EntityTable<MPW_ASM_RESULT_STATUS, 'code'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: itemSchema
    });
    this.version(2).stores({
      items: itemSchema,
      references: refSchema
    });
    // type 필드 추가를 위한 버전 업그레이드
    this.version(3).stores({
      items: itemSchema,
      references: refSchema
    });
    this.version(4).stores({
      items: itemSchema,
      references: refSchema,
      codes: codeSchema
    });
    // Common Code 테이블 추가
    this.version(5).stores({
      items: itemSchema,
      references: refSchema,
      codes: codeSchema,
      bumps: 'code, name, useTag, avail',
      corners: 'code, name, avail',
      statuses: 'code, name, avail',
      limits: 'code, name, minValue, maxValue, avail'
    });
    // Assembly 테이블 추가
    this.version(6).stores({
      items: itemSchema,
      references: refSchema,
      codes: codeSchema,
      bumps: 'code, name, useTag, avail',
      corners: 'code, name, avail',
      statuses: 'code, name, avail',
      limits: 'code, name, minValue, maxValue, avail',
      teams: '++id, teamCode, teamName, avail',
      decisionTypes: 'code, name, use_auto_sub, avail',
      taskFlows: 'code, name, sort, avail',
      resultStatuses: 'code, name, sort, avail'
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

      // Assembly 초기 데이터
      this.teams.bulkAdd([
        { teamCode: 'TEAM01', teamName: 'Assembly Team A', avail: 'Y' },
        { teamCode: 'TEAM02', teamName: 'Assembly Team B', avail: 'Y' },
        { teamCode: 'TEAM03', teamName: 'Assembly Team C', avail: 'Y' }
      ]);

      this.decisionTypes.bulkAdd([
        { code: 'DT001', name: 'Auto Decision', use_auto_sub: 'Y', avail: 'Y' },
        { code: 'DT002', name: 'Manual Decision', use_auto_sub: 'N', avail: 'Y' },
        { code: 'DT003', name: 'Hybrid Decision', use_auto_sub: 'Y', avail: 'Y' }
      ]);

      this.taskFlows.bulkAdd([
        { code: 'FLOW01', name: 'Preparation', sort: 1, avail: 'Y' },
        { code: 'FLOW02', name: 'Assembly', sort: 2, avail: 'Y' },
        { code: 'FLOW03', name: 'Inspection', sort: 3, avail: 'Y' },
        { code: 'FLOW04', name: 'Packaging', sort: 4, avail: 'Y' }
      ]);

      this.resultStatuses.bulkAdd([
        { code: 'RS001', name: 'Pass', sort: 1, avail: 'Y' },
        { code: 'RS002', name: 'Fail', sort: 2, avail: 'Y' },
        { code: 'RS003', name: 'Pending', sort: 3, avail: 'Y' },
        { code: 'RS004', name: 'Rework', sort: 4, avail: 'Y' }
      ]);
    });
  }
}

export const db = new AppDB();
