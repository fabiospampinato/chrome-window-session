
/* IMPORT */

import * as _ from 'lodash';
import Badge from './badge';
import Config from './config';
import State from './state';

/* WINDOW */

const Window = {

  /* HELPERS */

  async get ( id: number ) {

    return new Promise<any> ( resolve => {

      chrome.windows.get ( id, { populate: true }, resolve );

    });

  },

  async getName ( name: string ) {

    const names = await State.names ();

    let n = 2;
    while ( names.includes ( name ) ) {
      name = `${name} ${n}`;
      n++;
    }

    return name;

  },

  isEqual ( window1: chrome.windows.Window, window2: chrome.windows.Window ) {

    if ( !window1.tabs || !window2.tabs ) return false;
    if ( window1.tabs.length !== window2.tabs.length ) return false;

    return !window2.tabs.find ( ( tab, index ) => {
      return ( window1.tabs[index].url !== window2.tabs[index].url ); //TSC
    });

  },

  async isName ( window: chrome.windows.Window, name: string ) {

    const savedWindow = await State.name2window ( name );

    if ( !savedWindow ) return false;

    return Window.isEqual ( window, savedWindow );

  },

  async guessName ( window: chrome.windows.Window ) {

    const names = await State.names ();

    for ( let name of names ) {

      if ( await Window.isName ( window, name ) ) return name;

    }

    return;

  },

  dataify ( window: chrome.windows.Window ): chrome.windows.Window { // Get the useful data we need out of a window object

    return {
      id: window.id,
      tabs: ( window.tabs || [] ).map ( tab => {
        return _.pick ( tab, ['id', 'url', 'active', 'pinned', 'selected'] );
      })
    } as chrome.windows.Window; //UGLY //TSC

  },

  /* API */

  async save ( window: chrome.windows.Window, name: string = Config.window.name, prevName?: string ) {

    prevName = prevName || await State.window2name ( window );

    if ( prevName === name ) return;

    if ( prevName ) {
      await State.name2window ( prevName, null );
    }

    name = await Window.getName ( name );

    const data = Window.dataify ( window );

    await State.window2name ( data, name );
    await State.name2window ( name, data );

    Badge.updateWindow ( window );

  },

  async rename ( prevName: string, newName: string ) {

    const window = await State.name2window ( prevName );

    return Window.save ( window, newName, prevName );

  },

  focus ( window: chrome.windows.Window ) {

    chrome.windows.update ( window.id, { focused: true } );

  },

  async open ( name: string ) {

    const savedWindow = await State.name2window ( name );

    if ( !savedWindow ) return;

    const window = savedWindow && await Window.get ( savedWindow.id );

    if ( window ) return Window.focus ( window );

    chrome.windows.getCurrent ( { populate: true }, window => {

      /* RECYCLE */

      if ( Config.window.recycle && window.tabs && window.tabs.length === 1 ) {

        const tab = window.tabs[0];

        if ( tab.id && tab.url && tab.url.startsWith ( 'chrome://newtab' ) ) {

          savedWindow.tabs.forEach ( ({ url, active, pinned, selected }) => {
            chrome.tabs.create ({ url, active, pinned, selected });
          });

          return chrome.tabs.remove ( tab.id );

        }

      }

      /* NEW WINDOW */

      const url = savedWindow.tabs.map ( tab => tab.url ).filter ( _.identity );

      chrome.windows.create ( {url}, window => {
        if ( !window || !window.tabs ) return;
        savedWindow.tabs.forEach ( ( tab, index ) => {
          chrome.tabs.update ( window.tabs[index].id, { active: tab.active, pinned: tab.pinned, selected: tab.selected } );
        });
      });

    });

  },

  async update ( windowId: number ) {

    const window = await Window.get ( windowId );

    if ( window ) {

      const name = await State.window2name ( window ) || await Window.guessName ( window );

      if ( name ) {

        const data = Window.dataify ( window );

        await State.name2window ( name, data );
        await State.window2name ( data, name );

      }

    }

  },

  async delete ( name: string ) {

    const window = await State.name2window ( name );

    if ( !window ) return;

    await State.name2window ( name, null );
    await State.window2name ( window, null );

    Badge.updateWindow ( window );

  }

};

/* EXPORT */

export default Window;
