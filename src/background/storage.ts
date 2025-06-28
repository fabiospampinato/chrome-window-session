
/* IMPORT */

import type {Infer} from 'skex';
import {SessionsSchema} from './storage.schemas';

/* MAIN */

//TODO: Maybe switch to chrome.storage.sync once that can be supported perfectly

const Storage = {

  getSessions: async (): Promise<Infer<typeof SessionsSchema>> => {

    const storage = await chrome.storage.local.get ( 'sessions' );
    const sessions = storage['sessions'] ?? [];

    try {

      return SessionsSchema.filter ( sessions );

    } catch {

      return [];

    }

  },

  setSessions: async ( sessions: Infer<typeof SessionsSchema> ): Promise<void> => {

    await chrome.storage.local.set ({ sessions });

  },

  resetSessions: async (): Promise<void> => {

    await chrome.storage.local.set ({ sessions: [] });

  }

};

/* EXPORT */

export default Storage;
