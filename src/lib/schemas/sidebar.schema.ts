export interface MPW_SIDEBAR {
  id: number;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  openType: string;
  sort: number;
  parentId: number;
  avail: 'Y' | 'N';
  items: [MPW_SIDEBAR]
}

export const sidebarSchema = '++id';
