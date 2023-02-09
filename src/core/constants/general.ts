export const MSG_OK = 'OK';

export const STATUS_USER = {
  CREATE: 'CREATE',
  ENABLED: 'ENABLED',
  RESET: 'RESET',
  BLOCKED: 'BLOCKED',
};

export const INITIAL_STATUS = 'register';

export const INITIAL_OBSERVATION = 'register by awesome basilico';

export function IS_BLOCKED(status: string): boolean {
  return status === STATUS_USER.BLOCKED;
}
