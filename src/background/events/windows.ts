
/* IMPORT */

import State from '../state';
import Window from '../window';

/* WINDOWS */

const Windows = {

  /* HANDLERS */

  async onCreated ( window: chrome.windows.Window ) { //TODO: Support multiple windows with the same tabs (only the first matching one should be considered the same session)

    window = await Window.get ( window.id ); // In order to populate it

    const name = await Window.guessName ( window );

    if ( !name ) return;

    await State.name2window ( name, window );
    await State.window2name ( window, name );

  },

  async onRemoved ( windowId: number ) {

    return State.window2name ( windowId, null );

  },

  /* API */

  listen () {

    chrome.windows.onCreated.addListener ( Windows.onCreated );
    chrome.windows.onRemoved.addListener ( Windows.onRemoved );

  }

};

/* EXPORT */

export default Windows;
