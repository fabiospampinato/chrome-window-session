
/* IMPORT */

import Config from './config';
import State from './state';
import Window from './window';

/* BADGE */

const Badge = {

  /* BADGE */

  async update ( tabId?: number, windowId?: number ) {

    if ( !Config.badge.enabled.saved ) return;

    const window = windowId && await Window.get ( windowId ),
          name = window ? await State.window2name ( window ) || await Window.guessName ( window ) : undefined,
          tabsNr = window && window.tabs ? window.tabs.length : 0,
          text = tabsNr && ( Config.badge.enabled.unsaved || name ) ? String ( tabsNr ) : '';

    chrome.browserAction.setBadgeText ({ text, tabId });
    chrome.browserAction.setBadgeBackgroundColor ({ color: Config.badge.color, tabId });

  },

  /* TABS */

  updateTab ( tab: chrome.tabs.Tab ) {

    Badge.update ( tab.id, tab.windowId );

  },

  /* WINDOWS */

  updateWindow ( window: chrome.windows.Window ) {

    chrome.tabs.getSelected ( window.id, Badge.updateTab );

  },

  updateWindows () {

    chrome.windows.getAll ( { populate: true }, windows => {
      windows.forEach ( Badge.updateWindow );
    });

  }

};

/* EXPORT */

export default Badge;
