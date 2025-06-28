
/* IMPORT */

import Window from './window';

/* MAIN */

const Tabs = {

  onActivated: ( info: chrome.tabs.TabActiveInfo ): void => {

    Window.update ( info.windowId );

  },

  onAttached: ( tabId: number, info: chrome.tabs.TabAttachInfo ): void => {

    Window.update ( info.newWindowId );

  },

  onCreated: ( tab: chrome.tabs.Tab ): void => {

    Window.update ( tab.windowId );

  },

  onDetached: ( tabId: number, info: chrome.tabs.TabDetachInfo ): void => {

    Window.update ( info.oldWindowId );

  },

  onMoved: ( tabId: number, info: chrome.tabs.TabMoveInfo ): void => {

    Window.update ( info.windowId );

  },

  onRemoved: ( tabId: number, info: chrome.tabs.TabRemoveInfo ): void => { //TODO: If it was the last tab of a saved window, delete it (?)

    if ( info.isWindowClosing ) return;

    Window.update ( info.windowId );

  },

  onUpdated: ( tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab ): void => {

    Window.update ( tab.windowId );

  },

  listen: (): void => {

    chrome.tabs.onActivated.addListener ( Tabs.onActivated );
    chrome.tabs.onAttached.addListener ( Tabs.onAttached );
    chrome.tabs.onCreated.addListener ( Tabs.onCreated );
    chrome.tabs.onDetached.addListener ( Tabs.onDetached );
    chrome.tabs.onMoved.addListener ( Tabs.onMoved );
    chrome.tabs.onRemoved.addListener ( Tabs.onRemoved );
    chrome.tabs.onUpdated.addListener ( Tabs.onUpdated );

  }

};

/* EXPORT */

export default Tabs;
