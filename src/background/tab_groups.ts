
/* IMPORT */

import Window from './window';

/* MAIN */

const TabGroups = {

  onCreated: ( group: chrome.tabGroups.TabGroup ): void => {

    Window.update ( group.windowId );

  },

  onRemoved: ( group: chrome.tabGroups.TabGroup ): void => {

    Window.update ( group.windowId );

  },

  onUpdated: ( group: chrome.tabGroups.TabGroup ): void => {

    Window.update ( group.windowId );

  },

  listen: (): void => {

    chrome.tabGroups.onCreated.addListener ( TabGroups.onCreated );
    chrome.tabGroups.onRemoved.addListener ( TabGroups.onRemoved );
    chrome.tabGroups.onUpdated.addListener ( TabGroups.onUpdated );

  }

};

/* EXPORT */

export default TabGroups;
