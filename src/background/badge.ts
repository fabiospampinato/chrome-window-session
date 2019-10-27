
/* IMPORT */

import * as _ from 'lodash';
import Config from './config';
import State from './state';
import Window from './window';

/* BADGE */

const Badge = {

  /* BADGE */

  async update ( windowId?: number, tabId?: number ) {

    if ( !Config.badge.enabled.saved ) return;

    const window = windowId && await Window.get ( windowId );

    if ( !window ) return;

    if ( _.isUndefined ( tabId ) ) return Badge.updateWindow ( window );

    const name = window ? await State.window2name ( window ) || await Window.guessName ( window ) : undefined,
          tabsNr = window && window.tabs ? window.tabs.length : 0,
          text = tabsNr && ( Config.badge.enabled.unsaved || name ) ? String ( tabsNr ) : '';

    chrome.browserAction.setBadgeText ({ text, tabId });
    chrome.browserAction.setBadgeBackgroundColor ({ color: Config.badge.color, tabId });

  },

  /* TABS */

  updateTab ( tab: chrome.tabs.Tab ) {

    Badge.update ( tab.windowId, tab.id );

  },

  /* WINDOWS */

  updateWindow ( window: chrome.windows.Window ) {

    chrome.tabs.getSelected ( window.id, ( tab?: chrome.tabs.Tab ) => {
      if ( !tab ) return;
      Badge.updateTab ( tab );
    });

  },

  updateWindows () {

    chrome.windows.getAll ( { populate: true }, windows => {
      windows.forEach ( Badge.updateWindow );
    });

  }

};

/* EXPORT */

export default Badge;
