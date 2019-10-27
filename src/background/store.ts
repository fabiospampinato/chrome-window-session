
/* IMPORT */

import * as _ from 'lodash';

/* STORE */

const Store = {

  async get ( keys: string | string[] | object | null ) {

    return new Promise<any> ( resolve => {

      chrome.storage.local.get ( keys, resolve );

    });

  },

  async set ( items: object ) {

    return new Promise<any> ( resolve => {

      chrome.storage.local.set ( items, resolve );

    });

  },

  async map ( id: string, key?: string | number, value? ) { // Utility for performing `get/set/delete` on an object

    const map = ( await Store.get ( id ) )[id] || {};

    if ( _.isUndefined ( key ) ) { // Get Everything

      return map;

    } else if ( value === null ) { // Delete

      delete map[key];

      return Store.set ({ [id]: map });

    } else if ( !_.isUndefined ( value ) ) { // Set

      map[key] = value;

      return Store.set ({ [id]: map });

    } else { // Get

      return map[key];

    }

  }

};

/* EXPORT */

export default Store;
