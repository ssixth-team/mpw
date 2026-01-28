export interface MPW_BUMP {
  code: string;
  name: string;
  useTag: 'Y' | 'N';
  avail: 'Y' | 'N';
}

export const bumpSchema = 'code';
