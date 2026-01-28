import { itemHandlers } from './items';
import { referenceHandlers } from './references';
import { authHandlers } from './auth';
import { bumpHandlers } from './bumps';
import { cornerHandlers } from './corners';
import { statusHandlers } from './statuses';
import { limitsHandlers } from './limits';

export const handlers = [
  ...itemHandlers,
  ...referenceHandlers,
  ...authHandlers,
  ...bumpHandlers,
  ...cornerHandlers,
  ...statusHandlers,
  ...limitsHandlers
];
