
/* IMPORT */

import Badge from './badge';
import Session from './session';
import Sessions from './sessions';
import {getWindowTabs, getWindowsTabGroups} from './utils';

/* MAIN */

const Window = {

  get: ( windowId: number ): Promise<chrome.windows.Window | undefined> => {

    return chrome.windows.get ( windowId, { populate: true } );

  },

  getCurrent: (): Promise<chrome.windows.Window> => {

    return chrome.windows.getLastFocused ({ populate: true });

  },

  update: async ( windowId: number ): Promise<void> => {

    const window = await Window.get ( windowId );

    if ( !window ) return;

    await Window.updateBadges ( window );

    const sessions = await Sessions.getSaved ();
    const session = sessions.find ( session => session.windowId === windowId );

    if ( !session ) return;

    await Window.updateTabs ( window, session );

  },

  updateBadges: ( window: chrome.windows.Window ): Promise<void> => {

    return Badge.updateWindow ( window );

  },

  updateTabs: async ( window: chrome.windows.Window, session: Session ): Promise<void> => {

    const tabs = getWindowTabs ( window );
    const tabGroups = await getWindowsTabGroups ( window );

    return Session.update ( session.id, { tabs, tabGroups } );

  }

};

/* EXPORT */

export default Window;
