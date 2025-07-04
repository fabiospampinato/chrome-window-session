
/* IMPORT */

import levenshtein from 'tiny-levenshtein';
import Registry from './registry';
import Storage from './storage';
import Window from './window';
import Windows from './windows';
import {getSessionUrls, getWindowTabs, getWindowsTabGroups, getWindowUrls} from './utils';

/* MAIN */

const Sessions = {

  getCurrent: async (): Promise<Session | SessionTemporary | undefined> => {

    const window = await Window.getCurrent ();
    const windowId = window.id;

    if ( !windowId ) return;

    const sessions = await Sessions.getSaved ();
    const sessionSaved = sessions.find ( session => session.windowId === windowId );

    if ( sessionSaved ) return sessionSaved;

    const tabs = getWindowTabs ( window );
    const tabGroups = await getWindowsTabGroups ( window );
    const sessionTemporary = { tabs, tabGroups, windowId };

    return sessionTemporary;

  },

  getSaved: async (): Promise<Session[]> => {

    const saved: Session[] = [];
    const sessions = await Storage.getSessions ();
    const sessionsSet = new Set ( sessions );
    const windows = await Windows.get ();
    const windowsSet = new Set ( windows );
    const windowIdsToSessionIds = Registry.getWindowIdsToSessionIds ();

    /* REGISTERED WINDOWS */

    for ( const [windowIdRaw, sessionId] of Object.entries ( windowIdsToSessionIds ) ) {

      const windowId = Number ( windowIdRaw );
      const window = windows.find ( window => window.id === windowId );

      if ( !window ) continue;

      const session = sessions.find ( session => session.id === sessionId );

      if ( !session ) continue;

      saved.push ({ ...session, windowId });

      sessionsSet.delete ( session );
      windowsSet.delete ( window );

      Registry.link ( windowId, session.id );

    }

    /* MATCHED WINDOWS */

    for ( const maxDistance of [0, 1, 2] ) {

      for ( const session of sessionsSet ) {

        for ( const window of windowsSet ) {

          const sessionUrls = getSessionUrls ( session );
          const windowUrls = getWindowUrls ( window );
          const distance = levenshtein ( windowUrls, sessionUrls );

          if ( distance > maxDistance ) continue;
          if ( distance > 0 && windowUrls.length < maxDistance * 3 ) continue;

          const windowId = window.id ?? 0;

          saved.push ({ ...session, windowId });

          sessionsSet.delete ( session );
          windowsSet.delete ( window );

          Registry.link ( windowId, session.id );

          break;

        }

      }

    }

    /* UNMATCHED WINDOWS */

    for ( const session of sessionsSet ) {

      const windowId = undefined;

      saved.push ({ ...session, windowId });

      sessionsSet.delete ( session );

    }

    return saved;

  },

  set: async ( sessions: Session[] ): Promise<void> => {

    const stored = sessions.map ( ({ id, name, tabs, tabGroups }) => ({ id, name, tabs, tabGroups }) );

    await Storage.setSessions ( stored );

  }

};

/* EXPORT */

export default Sessions;
