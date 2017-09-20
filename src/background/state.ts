
/* IMPORT */

import * as _ from 'lodash';
import Store from './store';
import Utils from './utils';
import Windows from './events/windows';

/* STATE */

const State = {

  /* MAPS */

  namesSync ( name2window ) {

    const names = Object.keys ( name2window ),
          sorted = _.sortBy ( names, [x => x.toLowerCase ()] );

    return sorted;

  },

  async names () {

    const name2window = await State.name2window ();

    return State.namesSync ( name2window );

  },

  async name2window ( name?: string, window?: null | chrome.windows.Window ) {

    return Store.map ( 'name2window', name, window );

  },

  async window2name ( window?: number | chrome.windows.Window, name?: null | string ) {

    const windowId = Utils.window2id ( window );

    return Store.map ( 'window2name', windowId, name );

  },

  /* API */

  async init () {

    await Store.set ({
      window2name: {}
    });

    chrome.windows.getAll ( { populate: true }, windows => {
      windows.forEach ( window => {
        Windows.onCreated ( window );
      });
    });

  }

}

/* EXPORT */

export default State;
