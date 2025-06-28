
/* IMPORT */

import Sessions from './sessions';

/* HELPERS */

const SESSION_TO_WINDOW: Partial<Record<string, number>> = {};
const WINDOW_TO_SESSION: Partial<Record<number, string>> = {};

/* MAIN */

// The purpose of the registry is to provide a stable map between windows and sessions
// So that things can be updated properly and refreshed quickly

const Registry = {

  getSessionIdByWindowId: ( windowId: number ): string | undefined => {

    return WINDOW_TO_SESSION[windowId];

  },

  getSessionIdsToWindowIds: (): Partial<Record<string, number>> => {

    return { ...SESSION_TO_WINDOW };

  },

  getWindowIdBySessionId: ( sessionId: string ): number | undefined => {

    return SESSION_TO_WINDOW[sessionId];

  },

  getWindowIdsToSessionIds: (): Partial<Record<number, string>> => {

    return { ...WINDOW_TO_SESSION };

  },

  hasSessionId: ( sessionId: string ): boolean => {

    return ( sessionId in SESSION_TO_WINDOW );

  },

  hasWindowId: ( windowId: number ): boolean => {

    return ( windowId in WINDOW_TO_SESSION );

  },

  link ( windowId: number, sessionId: string ): void {

    SESSION_TO_WINDOW[sessionId] = windowId;
    WINDOW_TO_SESSION[windowId] = sessionId;

  },

  unlinkSession ( sessionId: string ): void {

    const windowId = SESSION_TO_WINDOW[sessionId];

    if ( !windowId ) return;

    delete SESSION_TO_WINDOW[sessionId];
    delete WINDOW_TO_SESSION[windowId];

  },

  unlinkWindow ( windowId: number ): void {

    const sessionId = WINDOW_TO_SESSION[windowId];

    if ( !sessionId ) return;

    delete SESSION_TO_WINDOW[sessionId];
    delete WINDOW_TO_SESSION[windowId];

  },

  update: async (): Promise<void> => {

    await Sessions.getSaved ();

  }

};

/* EXPORT */

export default Registry;
