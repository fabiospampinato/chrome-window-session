
/* IMPORT */

import Badge from '../badge';
import Window from '../window';

/* TABS */

const Tabs = {

  /* HANDLERS */

  async onChanged ( tabId: number, windowId: number ) {

    await Badge.update ( tabId, windowId );
    await Window.update ( windowId );

  },

  async onCreated ( tab: chrome.tabs.Tab ) {

    if ( !tab.id ) return;

    return Tabs.onChanged ( tab.id, tab.windowId );

  },

  async onDetached ( tabId: number, info: chrome.tabs.TabDetachInfo ) { //TODO: If it was the last tab of a saved window, delete it

    return Tabs.onChanged ( tabId, info.oldWindowId );

  },

  async onAttached ( tabId: number, info: chrome.tabs.TabAttachInfo ) {

    return Tabs.onChanged ( tabId, info.newWindowId );

  },

  async onRemoved ( tabId: number, info: chrome.tabs.TabRemoveInfo ) { //TODO: If it was the last tab of a saved window, delete it

    return Tabs.onChanged ( tabId, info.windowId );

  },

  async onMoved ( tabId: number, info: chrome.tabs.TabMoveInfo ) {

    return Tabs.onChanged ( tabId, info.windowId );

  },

  async onUpdated ( tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab ) {

    return Tabs.onChanged ( tabId, tab.windowId );

  },

  async onActivated ( info: chrome.tabs.TabActiveInfo ) {

    return Tabs.onChanged ( info.tabId, info.windowId );

  },

  /* API */

  listen () {

    chrome.tabs.onCreated.addListener ( Tabs.onCreated );
    chrome.tabs.onDetached.addListener ( Tabs.onDetached );
    chrome.tabs.onAttached.addListener ( Tabs.onAttached );
    chrome.tabs.onRemoved.addListener ( Tabs.onRemoved );
    chrome.tabs.onMoved.addListener ( Tabs.onMoved );
    chrome.tabs.onUpdated.addListener ( Tabs.onUpdated );
    chrome.tabs.onActivated.addListener ( Tabs.onActivated );

  }

};

/* EXPORT */

export default Tabs;
