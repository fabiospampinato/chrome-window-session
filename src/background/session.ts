
/* IMPORT */

import Badge from './badge';
import Registry from './registry';
import Sessions from './sessions';
import Window from './window';
import {getSessionUrls} from './utils';

/* MAIN */

const Session = {

  delete: async ( id: string ): Promise<void> => {

    const sessions = await Sessions.getSaved ();
    const session = sessions.find ( session => session.id === id );
    const sessionsNext = sessions.filter ( session => session.id !== id );

    Registry.unlinkSession ( id );

    await Badge.updateWindow ( session?.windowId );
    await Sessions.set ( sessionsNext );

  },

  get: async ( id: string ): Promise<Session | undefined> => {

    const sessions = await Sessions.getSaved ();
    const session = sessions.find ( session => session.id === id );

    return session;

  },

  insert: async ( session: Session ): Promise<void> => {

    const sessions = await Sessions.getSaved ();
    const sessionsNext = [...sessions, session];

    Registry.link ( session.windowId, session.id );

    await Badge.updateWindow ( session.windowId ?? 0 );
    await Sessions.set ( sessionsNext );

  },

  open: async ( id: string ): Promise<void> => {

    const session = await Session.get ( id );

    if ( !session ) { // Nothing to do

      return;

    } else if ( session.windowId ) { // Existing window

      await chrome.windows.update ( session.windowId, { focused: true } );

    } else { // Recycle window | New window

      const window = await Window.getCurrent ();
      const windowId = window.id ?? 0;
      const tabs = window.tabs || [];
      const tab = tabs[0];

      if ( !Registry.hasWindowId ( windowId ) && tabs.length === 1 && tab?.url?.startsWith ( 'chrome://newtab' ) ) { // Recycle window

        Registry.link ( windowId, session.id );

        session.tabs.forEach ( tab => {

          chrome.tabs.create ( tab );

        });

        chrome.tabs.remove ( tab?.id ?? 0 );

      } else { // New window

        const url = getSessionUrls ( session );
        const window = await chrome.windows.create ({ url, focused: true, type: 'normal' });
        const windowId = window.id ?? 0;

        Registry.link ( windowId, session.id );

        session.tabs.forEach ( ( tab, index ) => {

          const tabId = window.tabs?.[index]?.id;

          if ( !tabId ) return;

          const {active, pinned, selected} = tab;

          chrome.tabs.update ( tabId, { active, pinned, selected } );

        });

      }

    }

  },

  rename: async ( id: string, name: string ): Promise<void> => {

    return Session.update ( id, { name } );

  },

  update: async ( id: string, session: Partial<Session> ): Promise<void> => {

    const sessions = await Sessions.getSaved ();
    const sessionsNext = sessions.map ( existing => existing.id === id ? { ...existing, ...session } : existing );

    await Sessions.set ( sessionsNext );

  }

};

/* EXPORT */

export default Session;
