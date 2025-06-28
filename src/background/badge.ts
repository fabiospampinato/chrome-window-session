
/* IMPORT */

import Config from './config';
import Registry from './registry';
import {isNumber} from './utils';
import Window from './window';
import Windows from './windows';

/* MAIN */

const Badge = {

  updateWindow: async ( windowId?: chrome.windows.Window | number ): Promise<void> => {

    const window = isNumber ( windowId ) ? await Window.get ( windowId ) : windowId || await Window.getCurrent ();

    if ( !window ) return;

    const isSaved = Registry.hasWindowId ( window.id ?? 0 );
    const config = isSaved ? Config.badge.saved : Config.badge.unsaved;
    const {enabled, background, foreground} = config;
    const tabsNr = window.tabs?.length ?? 0;
    const text = `\u200A\u200A${tabsNr}`; // We need some hair spaces for better alignment

    window.tabs?.forEach ( tab => {

      const tabId = tab.id;

      if ( enabled && tabsNr ) {

        chrome.action.setBadgeText ({ text, tabId });
        chrome.action.setBadgeBackgroundColor ({ color: background, tabId });
        chrome.action.setBadgeTextColor ({ color: foreground });

      } else {

        chrome.action.setBadgeText ({ text: '', tabId });

      }

    });

  },

  updateWindows: async (): Promise<void> => {

    const windows = await Windows.get ();

    windows.forEach ( Badge.updateWindow );

  }

};

/* EXPORT */

export default Badge;
